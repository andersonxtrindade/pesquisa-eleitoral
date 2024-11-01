import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Dashboard from './Dashboard';
import PopulateData from '../LoadData/PopulateData'; 
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar expand="lg" className="bg-dark-subtle">
          <Container>
            <Navbar.Brand as={Link} to="/">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/populate">Carga de Dados</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/populate" element={<PopulateData />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
