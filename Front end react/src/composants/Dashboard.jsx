import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import AuthContext from './AuthContext';

const DashboardDev = () => {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: null, fullName: '' });
  const { authToken } = useContext(AuthContext);

  // Récupérer les métadonnées de l'utilisateur
  useEffect(() => {
    const fetchUserMetadata = async () => {
      setLoadingUser(true);
      try {
        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserRole(response.data.userRole);
        setCurrentUser({
          id: response.data.userId,
          fullName: response.data.currentUser
        });
        
        if (response.data.userRole === 'DEVELOPER') {
          setSelectedDeveloperId(response.data.userId);
        }
      } catch (err) {
        console.error('Erreur métadonnées:', err);
        setError('Erreur de chargement des informations utilisateur');
        setLoadingStats(false);
        setLoadingDevelopers(false);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserMetadata();
  }, [authToken]);

  // Récupérer les statistiques mensuelles
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!userRole) return;
      
      setLoadingStats(true);
      setError('');
      try {
        const params = { year: selectedYear };
        
        if (userRole === 'EMPLOYE') {
          params.demandeurId = currentUser.id;
        } else if (userRole === 'DEVELOPER') {
          params.proprietaireId = currentUser.id;
        } else if (userRole === 'ADMIN' && selectedDeveloperId) {
          params.assigneeId = selectedDeveloperId;
        }

        const response = await axios.get(
          'http://localhost:8080/api/dashboard/monthly-stats',
          {
            params,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        
        setMonthlyStats(response.data);
      } catch (err) {
        console.error('Erreur stats mensuelles:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erreur de chargement des statistiques');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchMonthlyStats();
  }, [selectedYear, selectedDeveloperId, authToken, userRole, currentUser]);

  // Récupérer la liste des développeurs (uniquement pour les admins)
  useEffect(() => {
    const fetchDevelopers = async () => {
      if (userRole !== 'ADMIN') {
        setLoadingDevelopers(false);
        return;
      }

      setLoadingDevelopers(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8080/api/users/developers', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setDevelopers(response.data);
      } catch (err) {
        console.error('Erreur développeurs:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erreur de chargement des développeurs');
      } finally {
        setLoadingDevelopers(false);
      }
    };

    fetchDevelopers();
  }, [authToken, userRole]);

  const handleDeveloperChange = (event) => {
    setSelectedDeveloperId(event.target.value === 'all' ? null : parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  if (loadingUser || loadingStats || loadingDevelopers) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#333'
      }}>
        Tableau de Bord des Tickets
        {userRole === 'DEVELOPER' && ` - ${currentUser.fullName}`}
      </h1>
      
      {error && (
        <div className="error-banner" style={{ 
          color: 'white',
          backgroundColor: '#ff4444',
          padding: '10px',
          marginBottom: '20px', 
          textAlign: 'center',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div className="filters-section" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div className="filter-group" style={{ 
          display: 'flex',
          alignItems: 'center'
        }}>
          <label htmlFor="year" style={{ 
            marginRight: '10px', 
            fontWeight: 'bold',
            minWidth: '60px'
          }}>
            Année:
          </label>
          <select 
            id="year"
            value={selectedYear} 
            onChange={handleYearChange}
            className="select-filter"
            style={{ 
              padding: '8px 15px',
              borderRadius: '4px', 
              border: '1px solid #ddd',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer'
            }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {userRole === 'ADMIN' && (
          <div className="filter-group" style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <label htmlFor="developer" style={{ 
              marginRight: '10px', 
              fontWeight: 'bold',
              minWidth: '100px'
            }}>
              Développeur:
            </label>
            <select
              id="developer"
              value={selectedDeveloperId || 'all'}
              onChange={handleDeveloperChange}
              className="select-filter"
              style={{ 
                padding: '8px 15px',
                borderRadius: '4px', 
                border: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
                minWidth: '200px',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tous les développeurs</option>
              {developers.map(dev => (
                <option key={dev.id} value={dev.id}>
                  {dev.fullName || `${dev.firstname} ${dev.lastname}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="chart-wrapper" style={{ 
        width: '100%', 
        height: '450px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        {monthlyStats.length > 0 ? (
          <ResponsiveContainer>
            <AreaChart
              data={monthlyStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4a90e2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#50d166" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#50d166" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5a623" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(month) => monthNames[month - 1]}
                tick={{ fill: '#666' }}
              />
              <YAxis tick={{ fill: '#666' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingBottom: '20px'
                }}
              />
              <Area
                type="monotone"
                dataKey="createdCount"
                name="Tickets créés"
                stroke="#4a90e2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCreated)"
              />
              <Area
                type="monotone"
                dataKey="resolvedCount"
                name="Tickets résolus"
                stroke="#50d166"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResolved)"
              />
              <Area
                type="monotone"
                dataKey="inProgressCount"
                name="En cours"
                stroke="#f5a623"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInProgress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#666'
          }}>
            Aucune donnée disponible pour les critères sélectionnés
          </div>
        )}
      </div>

      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9em'
      }}>
        {userRole === 'ADMIN' && 'Vue administrateur - Tous les tickets'}
        {userRole === 'DEVELOPER' && `Vue développeur - Tickets assignés à ${currentUser.fullName}`}
        {userRole === 'EMPLOYE' && `Vue employé - Tickets créés par ${currentUser.fullName}`}
      </div>
    </div>
  );
};

export default DashboardDev;