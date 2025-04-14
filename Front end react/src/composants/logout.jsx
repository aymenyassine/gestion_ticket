// Logout.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import './logout.css';  // Fichier CSS pour les styles

const Logout = () => {
  const { setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Déconnexion
    </button>
  );
};

export default Logout;
