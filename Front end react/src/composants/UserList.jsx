import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Pour la navigation vers la page de modification
import AuthContext from './AuthContext';
import UserDeleteButton from './UserDeleteButton'; // Assurez-vous que le chemin est correct
import './UserList.css'; // Importez le fichier CSS pour les styles

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8080/api/users', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken]);

  const handleUserDeleted = (deletedUserId) => {
    // Mettre à jour la liste des utilisateurs après la suppression
    setUsers(users.filter(user => user.id !== deletedUserId));
  };

  if (loading) {
    return <div className="loading-container">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>Liste des Utilisateurs</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead className="user-table-header">
            <tr>
              <th>Nom</th>
              <th>Nom d'utilisateur</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="user-table-row">
                <td>{user.firstname} {user.lastname}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td className="user-actions">
                  <Link to={`/users/edit/${user.id}`} className="edit-button">
                    Modifier
                  </Link>
                  <UserDeleteButton userId={user.id} onUserDeleted={handleUserDeleted} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun utilisateur trouvé.</p>
      )}
    </div>
  );
};

export default UserList;