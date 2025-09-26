import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://clon-gpt-eqafaxhcb4c3h7ch.canadacentral-01.azurewebsites.net/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response);
        return Promise.reject(error);
    }
);

export const getChatHistory = (userId) => {
    return apiClient.get('/history', {
        headers: { 'x-user-id': userId }
    });
};

export const sendMessage = (userId, message, chatId) => {
    console.log('Sending message for user:', userId, 'chatId:', chatId);
    return apiClient.post(
        '/functions',
        { question: message, style: "default" },
        {
            params: { chatId },
            headers: { 'x-user-id': userId }
        }
    );
};

export const loadChat = (userId, chatId) => {
    console.log('Loading chat for user:', userId, 'chatId:', chatId);
    return apiClient.post(
        '/functions',
        { action: "load_chat" },
        {
            params: { chatId },
            headers: { 'x-user-id': userId }
        }
    );
};

export const getChatTopics = (chatId) => {
    return apiClient.get('/topics', {
        params: { chatId }
    });
};

export const generateDocument = (topic, actionType) => {
    return apiClient.post('/generate-document', {
        topic,
        actionType
    });
};

export const downloadDocument = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `documento-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/auth?action=login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const registerUser = async (nombre, email, telefono, password) => {
    try {
        const response = await apiClient.post('/auth?action=register', { nombre, email, telefono, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getUserData = async (userId) => {
    try {
        const response = await apiClient.get('/auth', {
            params: { 
                action: 'data_user', 
                id: userId 
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};