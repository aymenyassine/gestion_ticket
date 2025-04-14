  import React, { useState, useEffect, useContext } from 'react';
  import axios from 'axios';
  import { useNavigate, useParams } from 'react-router-dom';
  import AuthContext from '../composants/AuthContext';

  import './TicketForm.css'; // Importez le fichier CSS

  const TicketEditForm = () => {
    const { id: ticketId } = useParams();
    const [formData, setFormData] = useState({
      objet: '',
      details: '',
      demandeurId: '',
      proprietaireId: '',
      siteId: '',
      categorieId: '',
      urgenceId: '',
      status: '',
    });
    const [metadata, setMetadata] = useState({
      demandeurs: [],
      recepteurs: [],
      sites: [],
      categories: [],
      urgences: [],
    });
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchMetadataAndTicket = async () => {
        setLoading(true);
        setError('');
        try {
          const [metadataResponse, ticketResponse] = await Promise.all([
            axios.get('http://localhost:8080/api/tickets/metadata', {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }),
            axios.get(`http://localhost:8080/api/tickets/${ticketId}`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }),
          ]);
          setUserRole(metadataResponse.data.userRole);
          setMetadata(metadataResponse.data || {
            demandeurs: [],
            recepteurs: [],
            sites: [],
            categories: [],
            urgences: [],
          });

          setFormData({
            objet: ticketResponse.data.objet,
            details: ticketResponse.data.details,
            demandeurId: ticketResponse.data.demandeur?.id || '',
            proprietaireId: ticketResponse.data.proprietaire?.id || '',
            siteId: ticketResponse.data.site?.id || '',
            categorieId: ticketResponse.data.categorie?.id || '',
            urgenceId: ticketResponse.data.urgence?.id || '',
            status: ticketResponse.data.status?.name || '',
          });
        } catch (error) {
          console.error('Error fetching data for edit:', error);
          setError(error.response?.data?.message || 'Erreur lors de la récupération des informations du ticket ou des métadonnées.');
        } finally {
          setLoading(false);
        }
      };

      fetchMetadataAndTicket();
    }, [authToken, ticketId]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {

        const metadataResponse = await axios.get('http://localhost:8080/api/tickets/metadata', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setUserRole(metadataResponse.data.userRole);

        const response = await axios.put(`http://localhost:8080/api/tickets/${ticketId}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log('Ticket updated:', response.data);
        navigate('/tickets');
      } catch (error) {
        console.error('Error updating ticket:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Erreur lors de la mise à jour du ticket.');
      }
    };

    if (loading) {
      return <div className="loading-container">Chargement des informations du ticket...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="ticket-form-container">
        <h2>Modifier le Ticket</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="objet">Objet:</label>
            <input type="text" id="objet" name="objet" value={formData.objet} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="details">Détails:</label>
            <textarea id="details" name="details" value={formData.details} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="demandeurId">Demandeur:</label>
            <select id="demandeurId" name="demandeurId" value={String(formData.demandeurId)} onChange={handleChange} disabled>
              <option value="">Sélectionner un demandeur</option>
              {metadata.demandeurs && metadata.demandeurs.map(demandeur => (
                <option key={demandeur.id} value={String(demandeur.id)}>
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
            <select id="siteId" name="siteId" value={formData.siteId} onChange={handleChange}>
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
            <select id="categorieId" name="categorieId" value={formData.categorieId} onChange={handleChange}>
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
            <select id="urgenceId" name="urgenceId" value={formData.urgenceId} onChange={handleChange}>
              <option value="">Sélectionner une urgence</option>
              {metadata.urgences && metadata.urgences.map(urgence => (
                <option key={urgence.id} value={urgence.id}>
                  {urgence.description}
                </option>
              ))}
            </select>
          </div>
         
          <div className="form-group">
  {userRole === 'DEVELOPER' && (
    <>
      <label htmlFor="status">Statut:</label>
      <select id="status" name="status" value={formData.status} onChange={handleChange}>
        <option value="">Sélectionner un statut</option>
        <option value="NOUVEAU">Nouveau</option>
        <option value="EN_ATTENTE">En Attente</option>
        <option value="RESOLU">Résolu</option>
        <option value="FERME">Fermé</option>
        <option value="REJETE">Rejeté</option>
        <option value="ANNULE">Annulé</option>
        <option value="ESCALADE">Escalade</option>
      </select>
      </>
    )}
  </div>

         
         

          <button type="submit" className="submit-button">Enregistrer les modifications</button>
        </form>
      </div>
    );
  };

  export default TicketEditForm;