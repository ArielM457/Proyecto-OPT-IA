import React, { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import "../../styles/authPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [cardFlip, setCardFlip] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleToggle = () => {
    setCardFlip(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setCardFlip(false);
      setRegistrationSuccess(false);
    }, 300);
  };

  const handleRegistrationSuccess = (email) => {
    setRegisteredEmail(email);
    setRegistrationSuccess(true);
    setTimeout(() => {
      setIsLogin(true);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className={`auth-card ${cardFlip ? 'flip' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
            <h2 className="auth-title">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>

            {registrationSuccess && (
              <div className="form-success">
                ¡Registro exitoso! Por favor inicia sesión con tus credenciales.
              </div>
            )}

            {isLogin ? (
              <LoginForm prefilledEmail={registeredEmail} />
            ) : (
              <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
            )}

            <p className="auth-toggle">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
              <button
                type="button"
                onClick={handleToggle}
                className="auth-toggle-btn"
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;