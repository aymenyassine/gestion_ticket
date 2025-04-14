import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../composants/AuthContext'; // Assurez-vous que le chemin est correct
import './TicketDetails.css'; // Importez le fichier CSS pour les styles

const TicketDetails = () => {
  const { id: ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      setError('');
      try {

        const metadataResponse = await axios.get('http://localhost:8080/api/tickets/metadata', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setUserRole(metadataResponse.data.userRole);


        const response = await axios.get(`http://localhost:8080/api/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setTicket(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticket details:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Erreur lors de la récupération des détails du ticket.');
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [authToken, ticketId]);

  if (loading) {
    return <div className="loading-container">Chargement des détails du ticket...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!ticket) {
    return <div className="no-ticket">Ticket non trouvé.</div>;
  }

  return (
    <div className="ticket-details-container">
      <h2>Détails du Ticket #{ticket.id}</h2>
      <div className="detail-item">
        <strong className="label">Objet:</strong>
        <span className="value">{ticket.objet}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Détails:</strong>
        <span className="value">{ticket.details}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Demandeur:</strong>
        <span className="value">{ticket.demandeur?.fullName || 'Non spécifié'}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Propriétaire:</strong>
        <span className="value">{ticket.proprietaire?.fullName || 'Non spécifié'}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Site:</strong>
        <span className="value">{ticket.site?.description || 'Non spécifié'}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Catégorie:</strong>
        <span className="value">{ticket.categorie?.description || 'Non spécifiée'}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Urgence:</strong>
        <span className="value">{ticket.urgence?.description || 'Non spécifiée'}</span>
      </div>
      <div className="detail-item">
        <strong className="label">Date de Création:</strong>
        <span className="value">{new Date(ticket.creationDate).toLocaleDateString()} {new Date(ticket.creationDate).toLocaleTimeString()}</span>
      </div>
      {ticket.updatedAt && (
        <div className="detail-item">
          <strong className="label">Date de Mise à Jour:</strong>
          <span className="value">{new Date(ticket.updatedAt).toLocaleDateString()} {new Date(ticket.updatedAt).toLocaleTimeString()}</span>
        </div>
      )}
      {/* Vous pouvez ajouter ici les boutons Modifier et Supprimer si nécessaire */}
      <div className="actions">
        {(userRole === 'DEVELOPER' || userRole === 'EMPLOYE') && (
          <Link to={`/tickets/edit/${ticket.id}`}>
            <button style={editButtonStyle}>Modifier</button>
          </Link>
        )}

        {/* <TicketDeleteButton ticketId={ticket.id} onTicketDeleted={TicketDeleteButton} /> */}
        {userRole === 'ADMIN' && (
          <button style={deleteButtonStyle}>Supprimer</button>
        )}
      </div>
    </div>
  );
};

const editButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '14px',
  marginRight: '5px',
  cursor: 'pointer',
  borderRadius: '4px',
};

const deleteButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
};

export default TicketDetails;