import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../composants/AuthContext';

const TicketDeleteButton = ({ ticketId, onTicketDeleted }) => {
  const { authToken } = useContext(AuthContext);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await axios.delete(`http://localhost:8080/api/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log('Ticket deleted:', ticketId);
        alert('Ticket supprimé avec succès');
        onTicketDeleted(ticketId);
      } catch (error) {
        console.error('Error deleting ticket:', error.response ? error.response.data : error.message);
        alert(error.response?.data?.message || 'Erreur lors de la suppression du ticket.');
      }
    }
  };

  return <button style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }} onClick={handleDelete}>Supprimer</button>;
};

export default TicketDeleteButton;