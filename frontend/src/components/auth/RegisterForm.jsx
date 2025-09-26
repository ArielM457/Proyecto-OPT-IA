// RegisterForm.jsx - Componente actualizado
import React, { useState } from "react";
import { registerUser } from "../../services/api";

const RegisterForm = ({ onRegistrationSuccess }) => {
  const [form, setForm] = useState({ 
    nombre: "", 
    email: "", 
    telefono: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await registerUser(form.nombre, form.email, form.telefono, form.password);
      onRegistrationSuccess(form.email);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="form">
      {error && <div className="form-error">{error}</div>}
      <div className="form-group">
        <input 
          type="text" 
          name="nombre" 
          value={form.nombre} 
          onChange={handleChange} 
          placeholder=" "
          className="form-input"
          required 
        />
        <label className="form-label">Nombre completo</label>
        <span className="input-highlight"></span>
      </div>
      <div className="form-group">
        <input 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          placeholder=" "
          className="form-input"
          required 
        />
        <label className="form-label">Email</label>
        <span className="input-highlight"></span>
      </div>
      <div className="form-group">
        <input 
          type="tel" 
          name="telefono" 
          value={form.telefono} 
          onChange={handleChange} 
          placeholder=" "
          className="form-input"
          required 
        />
        <label className="form-label">Teléfono</label>
        <span className="input-highlight"></span>
      </div>
      <div className="form-group">
        <input 
          type="password" 
          name="password" 
          value={form.password} 
          onChange={handleChange} 
          placeholder=" "
          className="form-input"
          required 
        />
        <label className="form-label">Contraseña</label>
        <span className="input-highlight"></span>
      </div>
      <button 
        type="submit" 
        className={`btn-primary ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? <div className="spinner"></div> : 'Registrarme'}
      </button>
    </form>
  );
};

export default RegisterForm;