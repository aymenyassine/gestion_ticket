import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../composants/AuthContext';
import axios from 'axios';
import Logout from '../composants/logout';
import './navbar.css';

const Navbar = () => {
  const { authToken } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!authToken) return;

      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8080/api/tickets/metadata', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setUserRole(response.data.userRole);
        console.log("User role récupéré :", response.data.userRole);
      } catch (err) {
        setError('Erreur de chargement des informations utilisateur');
        console.error("Error fetching user role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [authToken]);

  if (!authToken) return null;
  if (loading) return <div>Chargement des informations utilisateur...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/dashboard" className="brand-link">Gestion des Tickets</NavLink>
      </div>

      <button className="hamburger-menu" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          {userRole === 'ADMIN' && (
            <li className="nav-item has-dropdown">
              <button className="dropdown-toggle" onClick={() => setIsMobileMenuOpen(false)}>
                Gestion Utilisateurs 
              </button>
              <div className="dropdown-menu">
                <NavLink to="/users" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Liste des Utilisateurs</NavLink>
                <NavLink to="/users/create" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Ajouter un Utilisateur</NavLink>
              </div>
            </li>
          )}

          {(userRole === 'ADMIN' || userRole === 'EMPLOYE' || userRole === 'DEVELOPER') && (
            <li className="nav-item has-dropdown">
              <button className="dropdown-toggle" onClick={() => setIsMobileMenuOpen(false)}>
                Gestion des Tickets 
              </button>
              <div className="dropdown-menu">
                <NavLink to="/tickets" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Liste des Tickets</NavLink>
                <NavLink to="/tickets/create" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Créer un Ticket</NavLink>
              </div>
            </li>
          )}

          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
          </li>

          <li className="nav-item logout-item">
            <Logout />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;