import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './composants/register';
import Login from './composants/login';
import Dashboard from './composants/Dashboard';
import UserList from './composants/UserList';
import UserEditForm from './composants/UserEditForm';
import { AuthProvider } from './composants/AuthContext';
import AuthContext from './composants/AuthContext';
import TicketList from './composantsticket/TicketList';
import TicketCreateForm from './composantsticket/TicketCreateForm';
import TicketEditForm from './composantsticket/TicketEditForm';
import TicketDetails from './composantsticket/TicketDetails';
import { useContext } from 'react';
import Navbar from './base/navbar';


const PrivateRoute = ({ children, allowedRoles }) => {
  const { authToken, userRole } = useContext(AuthContext);
  
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/users/create" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          {/* Routes admin seulement */}
          <Route 
            path="/users" 
            element={
              <PrivateRoute >
                <UserList />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/users/edit/:id" 
            element={
              <PrivateRoute>
                <UserEditForm />
              </PrivateRoute>
            } 
          />

          {/* Routes pour tous les utilisateurs authentifiés */}
          <Route 
            path="/tickets" 
            element={
              <PrivateRoute >
                <TicketList />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/tickets/edit/:id" 
            element={
              <PrivateRoute >
                <TicketEditForm isEdit={true} />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/tickets/create" 
            element={
              <PrivateRoute >
                <TicketCreateForm isEdit={false} />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/tickets/:id" 
            element={
              <PrivateRoute >
                <TicketDetails />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;