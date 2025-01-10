import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Rutas
import Header from './components/Header';
import Inicio from './Pages/Inicio';
import LoginRegister from './Pages/LoginRegister';
import Tarifas from './Pages/Tarifas';
import Primero from './Pages/Primero';
import Galeria from './Pages/Galería';
import Usuarios from './Pages/Usuarios';
import Success from './Pages/Success';
import Cancel from './Pages/Cancel';
import Bloques from './components/Bloques';
import Contacto from './Pages/Contacto';

// Componente para rutas protegidas
import ProtectedRoute from './ProtectedRoutes';

function App() {
  return (
    <div>
      <Router>
        <div className="page-container">
          <Header />
          <main className="main-container">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/tarifas" element={<Tarifas />} />
              <Route path="/primero" element={<Primero />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/success" element={<Success />} />

              {/* Rutas protegidas */}
              <Route path="/usuarios" element={<ProtectedRoute element={<Usuarios />} />} />
              <Route path="/bloques" element={<ProtectedRoute element={<Bloques />} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
