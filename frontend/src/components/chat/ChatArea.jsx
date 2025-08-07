import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import ChatInput from './ChatInput';
import DocumentModal from './DocumentModal';
import { Box } from '@mui/material';

const ChatArea = ({ messages, isLoading, error, onSubmit }) => {
    const [documents, setDocuments] = useState([]);
    const [showDocuments, setShowDocuments] = useState(false);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.documents) {
            setDocuments(lastMessage.documents);
            if (lastMessage.documents.length > 0) {
                setShowDocuments(true);
            }
        }
    }, [messages]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100%',
            overflow: 'hidden'
        }}>
            <ChatHeader title="Bienvenido a OPT-IA" />
            
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                width: '100%'
            }}>
                <MessagesContainer 
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                />
            </Box>
            
            <Box sx={{
                width: '100%',
                flexShrink: 0
            }}>
                <ChatInput onSubmit={onSubmit} isLoading={isLoading} />
            </Box>

            <DocumentModal 
                documents={documents} 
                open={showDocuments} 
                onClose={() => setShowDocuments(false)} 
            />
        </Box>
    );
};

export default ChatArea;