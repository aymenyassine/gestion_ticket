import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../composants/AuthContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';
import './ticketlist.css';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // État pour la date sélectionnée dans la recherche
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }); // Dimanche
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  useEffect(() => {
    const fetchTicketsAndMetadata = async () => {
      setLoading(true);
      setError('');
      try {
        const metadataResponse = await axios.get('http://localhost:8080/api/tickets/metadata', {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        setUserRole(metadataResponse.data.userRole);
        setCurrentUserName(metadataResponse.data.currentUser);

        const response = await axios.get('http://localhost:8080/api/tickets', {
          headers: { Authorization: `Bearer ${authToken}` },
          params: {
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
          }
        });

        let filteredTickets = response.data;
        if (metadataResponse.data.userRole === 'EMPLOYE') {
          filteredTickets = response.data.filter(ticket =>
            ticket.demandeur?.fullName === metadataResponse.data.currentUser
          );
        }

        setTickets(filteredTickets);

      } catch (err) {
        setError('Erreur de chargement des tickets');
        console.error("Ticket fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsAndMetadata();
  }, [currentDate, authToken]);

  const getTicketsForDay = (date) => {
    return tickets.filter(ticket =>
      ticket.creationDate && isSameDay(new Date(ticket.creationDate), date)
    );
  };

  const handleMonthChange = (months) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + months);
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleDateInputChange = (event) => {
    const value = event.target.value;
    // Tentative de parser la date, format AAAA-MM-JJ (ISO 8601)
    const parsedDate = new Date(value);
    if (!isNaN(parsedDate)) {
      setSelectedDate(parsedDate);
      setCurrentDate(parsedDate); // Optionnel: naviguer aussi vers ce mois
    } else {
      setSelectedDate(null); // Réinitialiser si la date n'est pas valide
    }
  };

  const filteredTicketsByDate = selectedDate
    ? tickets.filter(ticket => ticket.creationDate && isSameDay(new Date(ticket.creationDate), selectedDate))
    : [];

  if (loading) return <div className="loading-container">Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="ticket-list-container">
      <div className="search-bar">
        <label htmlFor="datePicker">Choisir une date : </label>
        <input
          type="date"
          id="datePicker"
          onChange={handleDateInputChange}
          value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
        />
      </div>

      {selectedDate && filteredTicketsByDate.length > 0 && (
        <div className="filtered-tickets">
          <h3>Tickets du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}</h3>
          {filteredTicketsByDate.map(ticket => (
            <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="ticket-link">
              <div className="ticket-title">{ticket.objet}</div>
              <div className="ticket-info">
                {ticket.status?.name} • {ticket.urgence?.description || 'N/A'}
              </div>
            </Link>
          ))}
          {filteredTicketsByDate.length === 0 && <p>Aucun ticket pour cette date.</p>}
        </div>
      )}

      <div className="calendar-wrapper">
        <div className="calendar-header">
          <button onClick={() => handleMonthChange(-1)} className="month-button">
            ← Mois précédent
          </button>
          <h2 className="current-month">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button onClick={() => handleMonthChange(1)} className="month-button next">
            Mois suivant →
          </button>
        </div>

        <div className="calendar-grid">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}

          {daysInMonth.map((date, index) => {
            const dayTickets = getTicketsForDay(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate && isSameDay(date, selectedDate);

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'outside-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(date)}
              >
                <div className="day-number-container">
                  <span className={`day-number ${!isCurrentMonth ? 'outside-month-number' : ''} ${isToday ? 'today-number' : ''}`}>
                    {format(date, 'd', { locale: fr })}
                  </span>
                </div>

                <div className="tickets-container">
                  {dayTickets.map(ticket => (
                    <Link
                      key={ticket.id}
                      to={`/tickets/${ticket.id}`}
                      className="ticket-link"
                    >
                      <div className="ticket-title">{ticket.objet}</div>
                      <div className="ticket-info">
                        {ticket.status?.name} • {ticket.urgence?.description || 'N/A'}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TicketList;