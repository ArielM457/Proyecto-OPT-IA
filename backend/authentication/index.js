const { BlobServiceClient } = require('@azure/storage-blob');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
    context.res = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    };

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient("users");

        await containerClient.createIfNotExists();

        const { action } = req.query;
        const { email, nombre, password, telefono } = req.body || {};
        const { id } = req.query;

        if (!action) {
            context.res.status = 400;
            context.res.body = { error: "Debe especificar ?action=register, ?action=login o ?action=data_user" };
            return;
        }

        if (action === "register") {
            if (!email || !password || !nombre || !telefono) {
                context.res.status = 400;
                context.res.body = { error: "Faltan campos obligatorios" };
                return;
            }

            const blobName = `${email}.json`;
            const blobClient = containerClient.getBlockBlobClient(blobName);

            const exists = await blobClient.exists();
            if (exists) {
                context.res.status = 400;
                context.res.body = { error: "El usuario ya está registrado" };
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = uuidv4();

            const userData = {
                id: userId,
                email,
                nombre,
                telefono,
                password: hashedPassword
            };

            await blobClient.upload(JSON.stringify(userData), Buffer.byteLength(JSON.stringify(userData)));

            context.res.status = 201;
            context.res.body = { message: "Usuario registrado correctamente", id: userId };
            return;
        }

        if (action === "login") {
            if (!email || !password) {
                context.res.status = 400;
                context.res.body = { error: "Debe ingresar email y password" };
                return;
            }

            const blobName = `${email}.json`;
            const blobClient = containerClient.getBlockBlobClient(blobName);

            if (!(await blobClient.exists())) {
                context.res.status = 401;
                context.res.body = { error: "Usuario no encontrado" };
                return;
            }

            const downloadResponse = await blobClient.download();
            const userData = JSON.parse(await streamToString(downloadResponse.readableStreamBody));

            const validPassword = await bcrypt.compare(password, userData.password);
            if (!validPassword) {
                context.res.status = 401;
                context.res.body = { error: "Contraseña incorrecta" };
                return;
            }

            const token = jwt.sign(
                { id: userData.id, email: userData.email },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            context.res.status = 200;
            context.res.body = { token, id: userData.id };
            return;
        }

        if (action === "data_user") {
            if (!id) {
                context.res.status = 400;
                context.res.body = { error: "Debe proporcionar el ID del usuario" };
                return;
            }

            const blobs = containerClient.listBlobsFlat();
            let userData = null;

            for await (const blob of blobs) {
                const blobClient = containerClient.getBlockBlobClient(blob.name);
                const downloadResponse = await blobClient.download();
                const currentUserData = JSON.parse(await streamToString(downloadResponse.readableStreamBody));
                console.log(currentUserData);
                
                if (currentUserData.id === id) {
                    userData = {
                        id: currentUserData.id,
                        email: currentUserData.email,
                        nombre: currentUserData.nombre,
                        telefono: currentUserData.telefono
                    };
                    break;
                }
            }

            if (!userData) {
                context.res.status = 404;
                context.res.body = { error: "Usuario no encontrado" };
                return;
            }

            context.res.status = 200;
            context.res.body = userData;
            return;
        }


        context.res.status = 400;
        context.res.body = { error: "Acción inválida", action: action };

    } catch (error) {
        context.res.status = 500;
        context.res.body = { error: error.message };
    }
};

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}