// src/composantsticket/TicketCreateForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../composants/AuthContext';
import './TicketForm.css'; // Importez le fichier CSS

const TicketCreateForm = () => {
  const [formData, setFormData] = useState({
    objet: '',
    details: '',
    demandeurId: '',
    proprietaireId: '',
    siteId: '', 
    categorieId: '',
    urgenceId: '',
  });
  const [metadata, setMetadata] = useState({
    demandeurs: [],
    recepteurs: [],
    sites: [],
    categories: [],
    urgences: [],
    currentUser: '',
    userRole: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8080/api/tickets/metadata', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data || {
          demandeurs: [],
          recepteurs: [],
          sites: [],
          categories: [],
          urgences: [],
          currentUser: '',
          userRole: '',
        };
        setMetadata(data);
        // Pré-remplir le demandeur ici, après avoir reçu les métadonnées
        if (data.demandeurs.length > 0 && data.currentUser) {
          setFormData(prevFormData => ({
            ...prevFormData,
            demandeurId: data.demandeurs.find(d => d.fullName === data.currentUser)?.id || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching metadata:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Erreur lors de la récupération des données du formulaire.');
        setMetadata({
          demandeurs: [],
          recepteurs: [],
          sites: [],
          categories: [],
          urgences: [],
          currentUser: '',
          userRole: '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [authToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/tickets', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Ticket created:', response.data);
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Erreur lors de la création du ticket.');
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement des données du formulaire...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="ticket-form-container">
      <h2>Créer un Nouveau Ticket</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="objet">Objet:</label>
          <input type="text" id="objet" name="objet" value={formData.objet} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="details">Détails:</label>
          <textarea id="details" name="details" value={formData.details} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="demandeurId">Demandeur:</label>
          <select id="demandeurId" name="demandeurId" value={formData.demandeurId} onChange={handleChange} required>
            <option value="">Sélectionner un demandeur</option>
            {metadata.demandeurs && metadata.demandeurs.map(demandeur => (
              <option key={demandeur.id} value={demandeur.id}>
                {demandeur.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="proprietaireId">Propriétaire:</label>
          <select id="proprietaireId" name="proprietaireId" value={formData.proprietaireId} onChange={handleChange}>
            <option value="">Sélectionner un propriétaire</option>
            {metadata.recepteurs && metadata.recepteurs.map(recepteur => (
              <option key={recepteur.id} value={recepteur.id}>
                {recepteur.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="siteId">Site:</label>
          <select id="siteId" name="siteId" value={formData.siteId} onChange={handleChange} required>
            <option value="">Sélectionner un site</option>
            {metadata.sites && metadata.sites.map(site => (
              <option key={site.id} value={site.id}>
                {site.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="categorieId">Catégorie:</label>
          <select id="categorieId" name="categorieId" value={formData.categorieId} onChange={handleChange} required>
            <option value="">Sélectionner une catégorie</option>
            {metadata.categories && metadata.categories.map(categorie => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="urgenceId">Urgence:</label>
          <select id="urgenceId" name="urgenceId" value={formData.urgenceId} onChange={handleChange} required>
            <option value="">Sélectionner une urgence</option>
            {metadata.urgences && metadata.urgences.map(urgence => (
              <option key={urgence.id} value={urgence.id}>
                {urgence.description}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Créer le Ticket</button>
      </form>
    </div>
  );
};

export default TicketCreateForm;