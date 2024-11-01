import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Container, Row, Col, Table, Card, Form } from 'react-bootstrap';
import { Tooltip as BootstrapTooltip, OverlayTrigger } from 'react-bootstrap'; 
import api from '../../services/api';
import './App.css';

const dataReal = [
  { name: 'Candidato A', value: 400 },
  { name: 'Candidato B', value: 300 },
  { name: 'Candidato C', value: 300 },
];

const dataPonderado = [
  { name: 'Candidato A', value: 500 },
  { name: 'Candidato B', value: 200 },
  { name: 'Candidato C', value: 300 },
];

const calcularPorcentagemPonderada = (data) => {
  return data.map(candidate => ({
    name: candidate.intencao_voto,
    percentage: candidate.votos_ponderados.toFixed(2) + '%',
    value: candidate.votos_ponderados,
  }));
};

const calcularPorcentagemReal = (data) => {
  return data.map(candidate => ({
    name: candidate.intencao_voto,
    percentage: candidate.porcentagem_real.toFixed(2) + '%',
    value: candidate.votos_reais
  }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Dashboard = () => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado, setEstado] = useState('');
  const [idsPesquisa, setIdsPesquisa] = useState([]);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [pesquisas, setPesquisas] = useState([]);
  const [realVotes, setRealVotes] = useState([]);
  const [weightedVotes, setWeightedVotes] = useState([]);

  const getEstados = async () => {
    let response = await api.get('/localidades/estados');
    setEstados(response.data);
  };

  const getPesquisas = async () => {
    let response = await api.get('/pesquisas/ids');
    setIdsPesquisa(response.data);
  };

  const getMunicipios = async (estado) => {
    let url = `/localidades/cidades?estado=${estado}`;
    let response = await api.get(url);
    setEstado(estado);
    setMunicipios(response.data);
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
  
    if (idPesquisa !== '') params.append('id_pesquisa', idPesquisa);
    if (estado) {
      const estadoObj = estados.find(e => e.id === parseInt(estado));
      if (estadoObj) params.append('estado', estadoObj.sigla);
    };
    if (municipio) {
      const municipioObj = municipios.find(e => e.id === parseInt(municipio));
      if (municipioObj) params.append('municipio', municipioObj.nome);
    };
  
    let url = `/pesquisas${params.toString() ? `?${params.toString()}` : ''}`;
    
    let response = await api.get(url);
    setPesquisas(response.data);
    setRealVotes(calcularPorcentagemReal(response.data));
    setWeightedVotes(calcularPorcentagemPonderada(response.data));
  };  

  useEffect(() => {
    handleSearch();
  }, [idPesquisa, estado, municipio]);

  useEffect(() => {
    getEstados();
    getPesquisas();
  }, []);

  return (
    <Container>
      <Row className="mt-2">
        <Col>
          <h5>Filtro</h5>
          <Form>
            <Row>
              <Col md={4} className="mr-2">
                <Form.Group>
                  <Form.Label className="mr-2">Id da Pesquisa:</Form.Label>
                  <Form.Control
                    as="select"
                    value={idPesquisa}
                    onChange={(e) => setIdPesquisa(e.target.value)}
                  >
                    <option value="">Selecione uma Pesquisa</option>
                    {idsPesquisa.map((pesquisa) => (
                        <option key={pesquisa.id_pesquisa} value={pesquisa.id_pesquisa}>
                            {pesquisa.id_pesquisa}
                        </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="mr-2">Estado:</Form.Label>
                  <Form.Control
                    as="select"
                    value={estado}
                    onChange={(e) => getMunicipios(e.target.value)}
                  >
                    <option value="">Selecione um estado</option>
                    {estados.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                        {estado.nome}
                        </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4} className="mr-2">
                <Form.Group>
                  <Form.Label className="mr-2">Município:</Form.Label>
                  <Form.Control
                    as="select"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                  >
                    <option value="">Selecione um município</option>
                    {municipios.map((municipio) => (
                        <option key={municipio.id} value={municipio.id}>
                        {municipio.nome}
                        </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={6} style={{ marginTop: '10px' }}>
          <Card className="mb-4 shadow" style={{ height: '100%' }}>
            <Card.Body>
              <h6>Porcentagem Real</h6>
              <div className="d-flex justify-content-center">
                <PieChart width={400} height={400}>
                  <Pie
                    data={realVotes}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {realVotes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} style={{ marginTop: '10px' }}>
          <Card className="mb-4 shadow" style={{ height: '100%' }}>
            <Card.Body>
              <h6>Porcentagem Ponderada
                <OverlayTrigger
                  placement="right" 
                  overlay={
                    <BootstrapTooltip id="tooltip-info">
                      <div>
                        <strong>Peso dos votos:</strong><br />
                        - Municípios até 20 mil habitantes tem peso 1<br />
                        - Municípios entre 20 mil e 100 mil habitantes tem peso 2<br />
                        - Municípios entre 100 mil e 1 milhão de habitantes tem peso 5<br />
                        - Municípios acima de 1 milhão de habitantes tem peso 10
                      </div>
                    </BootstrapTooltip>
                  }
                >
                  <span style={{ cursor: 'pointer', fontSize: '1.2em', marginLeft: '5px' }}>
                    <i className="fa-solid fa-circle-info" />
                  </span>
                </OverlayTrigger>
              </h6>
              <div className="d-flex justify-content-center">
                <PieChart width={400} height={400}>
                  <Pie
                    data={weightedVotes}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {weightedVotes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6} style={{ marginTop: '10px' }}>
          <Card className="mb-4 shadow" style={{ height: '100%' }}>
            <Card.Body>
              <h6>Votos por Candidato (Porcentagem Real)</h6>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Quantidade de Votos</th>
                    <th>Porcentagem</th>
                  </tr>
                </thead>
                <tbody>
                  {pesquisas.map((candidato, index) => (
                    <tr key={index}>
                      <td>{candidato.intencao_voto}</td>
                      <td>{candidato.votos_reais}</td>
                      <td>{candidato.porcentagem_real.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} style={{ marginTop: '10px' }}>
          <Card className="mb-4 shadow" style={{ height: '100%' }}>
            <Card.Body>
              <h6>Votos por Candidato (Porcentagem Ponderada)</h6>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Peso</th>
                    <th>Porcentagem Ponderada</th>
                  </tr>
                </thead>
                <tbody>
                  {pesquisas.map((candidato, index) => (
                    <tr key={index}>
                      <td>{candidato.intencao_voto}</td>
                      <td>{candidato.votos_ponderados}</td>
                      <td>{candidato.porcentagem_ponderada.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
