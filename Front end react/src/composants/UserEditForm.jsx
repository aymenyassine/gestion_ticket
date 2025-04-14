import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import './UserForm.css'; // Importez le fichier CSS

const UserEditForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    role: 'USER',
    password: '', // Nouveau champ pour le mot de passe
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // Ne pré-remplissez pas le mot de passe pour des raisons de sécurité
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          username: response.data.username,
          role: response.data.role,
          password: '', // Laissez le champ de mot de passe vide
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Erreur lors de la récupération des informations de l\'utilisateur.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, authToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('User updated:', response.data);
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur.');
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement des informations de l'utilisateur...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-form-container">
      <h2>Modifier l'Utilisateur</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="firstname">Prénom:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Nom:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Nouveau Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <small className="form-text">Laissez ce champ vide pour ne pas modifier le mot de passe.</small>
        </div>
        <div className="form-group">
          <label htmlFor="role">Rôle:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="EMPLOYE">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
            <option value="DEVELOPER">Technicien</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Enregistrer les modifications</button>
      </form>
    </div>
  );
};

export default UserEditForm;