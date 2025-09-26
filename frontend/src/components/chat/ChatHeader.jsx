import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserModal from '../user/userModal';
import { getUserData } from '../../services/api';

const ChatHeader = ({ title }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const isAuth = !!token && !!userId;
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      fetchUserData(userId);
    }
}, []);

useEffect(() => {
    checkAuthentication();
}, [checkAuthentication]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserData(userId);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };



  const handleUserButtonClick = () => {
    if (isAuthenticated) {
      setModalOpen(true);
    } else {
      navigate("/auth");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserData(null);
    setModalOpen(false);
    navigate("/auth");
  };

  const handleRetry = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserData(userId);
    }
  };

  return (
    <div className="chat-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '0 16px',
      position: 'relative' 
    }}>
      <Typography 
        variant="h6" 
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}
      >
        {title}
      </Typography>
      
      <div style={{ marginLeft: 'auto' }}>
        <Button
          variant="contained"
          onClick={handleUserButtonClick}
          disabled={loading}
          sx={{
            borderRadius: '20px',
            backgroundColor: '#4361ee',
            '&:hover': {
              backgroundColor: '#3a0ca3'
            },
            minWidth: '120px'
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isAuthenticated ? (
            userData?.nombre || 'Usuario'
          ) : (
            'Login'
          )}
        </Button>
      </div>

      <UserModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        userData={userData}
        onLogout={handleLogout}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default ChatHeader;