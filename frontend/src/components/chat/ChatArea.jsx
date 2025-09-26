import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import ChatInput from './ChatInput';
import DocumentModal from './DocumentModal';

const ChatArea = ({ messages, isLoading, error, onSubmit }) => {
    const [documents, setDocuments] = useState([]);
    const [showDocuments, setShowDocuments] = useState(false);
    const messagesContainerRef = useRef(null);

    // Efecto para manejar documentos
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.documents) {
            setDocuments(lastMessage.documents);
            if (lastMessage.documents.length > 0) {
                setShowDocuments(true);
            }
        }
    }, [messages]);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Manejar el envío de mensajes
    const handleSubmit = async (input) => {
        if (onSubmit) {
            await onSubmit(input);
        }
    };

    return (
        <div className="chat-main">
            <ChatHeader title="Bienvenido a OPT-IA" />

            <div 
                ref={messagesContainerRef}
                className="messages-container"
            >
                <MessagesContainer 
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
            
            <div className="input-container">
                <ChatInput 
                    onSubmit={handleSubmit} 
                    isLoading={isLoading} 
                />
            </div>

            <DocumentModal 
                documents={documents} 
                open={showDocuments} 
                onClose={() => setShowDocuments(false)} 
            />
        </div>
    );
};

export default ChatArea;