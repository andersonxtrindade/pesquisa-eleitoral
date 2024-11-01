import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import api from '../../services/api';

const PopulatePage = () => {
  const [file, setFile] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  useEffect(() => {
    const fetchPeriods = async () => {
      const response = await api.get('/population-periods');
      setPeriods(response.data);
    };
    fetchPeriods();
  }, []);

  const handlePopulateClick = async () => {
    try {
      if (selectedPeriod === '') {
        alert('Selecione um periodo antes de enviar.');
        return;
      }
      let url = `/populate?ano=${selectedPeriod}`;
      await api.post(url);
      alert('Carga do ibge feita com sucesso!');
    } catch (error) {
      alert('Erro ao acionar carga do ibge.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Selecione a pesquisa antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      let res = await api.post('/populate-research', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      alert('Erro ao enviar arquivo.');
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h5>Carga de Dados do IBGE - Estados, Municípios e População</h5>
              <Form.Group controlId="formPeriod" className="mb-3">
                <Form.Label>Período da Pesquisa</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="">Selecione um período</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.value}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handlePopulateClick}>
                Executar Inserção
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h5>Enviar Pesquisa (CSV)</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Arquivo CSV</Form.Label>
                  <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="success" type="submit">
                  Enviar Pesquisa
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PopulatePage;
