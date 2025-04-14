import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const UserDeleteButton = ({ userId, onUserDeleted }) => {
  const { authToken } = useContext(AuthContext);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Assurez-vous que authToken est valide et présent
          },
        });
        console.log('User deleted:', response.data);
        alert(response.data);
        onUserDeleted(userId);
      } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
        alert(error.response?.data || 'Erreur inconnue lors de la suppression de l\'utilisateur.');
      }
    }
  };

  return <button style={{ /* ... styles ... */ }} onClick={handleDelete}>Supprimer</button>;
};

export default UserDeleteButton;