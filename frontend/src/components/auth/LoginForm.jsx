import React, { useState, useEffect } from "react";
import { loginUser } from "../../services/api";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ prefilledEmail = "" }) => {
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(prefilledEmail);
  }, [prefilledEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      {error && <div className="form-error">{error}</div>}
      <div className="form-group">
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder=" "
          className="form-input"
          required 
        />
        <label className="form-label">Email</label>
        <span className="input-highlight"></span>
      </div>
      <div className="form-group">
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
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
        {isLoading ? <div className="spinner"></div> : 'Ingresar'}
      </button>
    </form>
  );
};

export default LoginForm;