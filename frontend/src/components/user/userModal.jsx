import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Divider 
} from '@mui/material';

const UserModal = ({ open, onClose, userData, onLogout }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Información del Usuario</DialogTitle>
      <DialogContent>
        {userData ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Nombre:</strong> {userData.nombre}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Teléfono:</strong> {userData.telefono}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>ID:</strong> {userData.id}
            </Typography>
          </Box>
        ) : (
          <Typography>Cargando información...</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button onClick={onLogout} color="error" variant="outlined">
          Cerrar Sesión
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;