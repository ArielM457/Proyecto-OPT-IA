import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import AuthPage from './components/auth/AuthPage.jsx'; // <- nuevo
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './styles/base.css';
import './styles/variables.css';
import './styles/sidebar.css';
import './styles/chat.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#4db6ac' },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* Redirigir cualquier otra ruta a /auth */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
