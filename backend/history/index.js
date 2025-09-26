const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    context.res = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    };

    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            context.res.status = 400;
            context.res.body = { error: "Se requiere el header x-user-id" };
            return;
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient("chatia");

        const chatList = [];
        
        console.log(`Buscando blobs con prefijo: ${userId}/`);
        
        for await (const blob of containerClient.listBlobsFlat({ prefix: `${userId}/` })) {
            console.log(`Blob encontrado: ${blob.name}`);
            
            if (blob.name.endsWith('.json')) {
                try {
                    const blobClient = containerClient.getBlockBlobClient(blob.name);
                    const properties = await blobClient.getProperties();
                    
                    const downloadResponse = await blobClient.download();
                    const historyContent = await streamToString(downloadResponse.readableStreamBody);
                    const history = JSON.parse(historyContent);
                    
                    if (history && history.length > 0) {
                        const lastUserMessage = [...history].reverse().find(msg => msg.role === 'user');
                        const lastMessage = lastUserMessage?.content || 'Nuevo chat';
                        
                        const chatId = blob.name.split('/')[1]?.replace('.json', '');
                        
                        if (chatId) {
                            chatList.push({
                                id: chatId,
                                title: lastMessage.substring(0, 50),
                                lastMessage: properties.lastModified.toISOString(),
                                preview: lastMessage.substring(0, 100) + (lastMessage.length > 100 ? '...' : ''),
                                messageCount: history.length
                            });
                        }
                    }
                } catch (parseError) {
                    console.error(`Error procesando blob ${blob.name}:`, parseError);
                    continue;
                }
            }
        }

        chatList.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage));

        console.log(`Chats encontrados para usuario ${userId}:`, chatList.length);

        context.res.body = { 
            chats: chatList,
            count: chatList.length,
            userId: userId 
        };

    } catch (error) {
        console.error('Error en función de historial:', error);
        context.res.status = 500;
        context.res.body = { 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
};

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data.toString());
        });
        readableStream.on('end', () => {
            resolve(chunks.join(''));
        });
        readableStream.on('error', reject);
    });
}