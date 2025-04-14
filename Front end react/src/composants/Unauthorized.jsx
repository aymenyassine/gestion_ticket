import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000); // Redirige après 3 secondes

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Accès Refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <p>Vous serez redirigé vers le tableau de bord dans quelques secondes...</p>
      </div>
    </div>
  );
};

export default Unauthorized;