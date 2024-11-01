import axios from "axios";
import { openDb } from "../config/configDB.js";

export async function fetchPopulationPeriods() {
  try {
    const response = await axios.get(
      "https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos"
    );
    const periods = response.data.map((period) => ({
      id: period.id,
      value: period.id,
    }));
    console.log("Períodos pesquisados com sucesso.");
    return periods;
  } catch (error) {
    console.error("Erro ao buscar periodos", error);
  }
}

async function fetchAndStoreEstados() {
  const db = await openDb();
  try {
    const response = await axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );
    const estados = response.data;

    const insertEstado = `
      INSERT INTO Estado (id, sigla, nome) 
      VALUES (?, ?, ?) 
      ON CONFLICT(id) DO UPDATE SET 
        sigla = excluded.sigla, 
        nome = excluded.nome;
    `;  
    await db.exec("BEGIN TRANSACTION");
    for (const estado of estados) {
      await db.run(insertEstado, [estado.id, estado.sigla, estado.nome]);
    }
    await db.exec("COMMIT");
    console.log("Estados inseridos com sucesso.");
  } catch (error) {
    console.error("Erro ao buscar ou inserir estados:", error);
  }
}

async function fetchAndStoreMunicipios(ano) {
  const db = await openDb();
  try {
    const response = await axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    );
    const responsePopulation = await axios.get(
      `https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/${ano}/variaveis/9324?localidades=N6[all]`
    );
    const municipios = response.data;
    const populacao = responsePopulation.data[0].resultados[0].series;

    const populationById = {};

    populacao.forEach((obj) => {
      populationById[obj.localidade.id] = obj.serie;
    });

    municipios.forEach((municipio) => {
      const serieEncontrada = populationById[municipio.id.toString()];
      if (serieEncontrada) {
        municipio.serie = serieEncontrada;
      }
    });

    const insertMunicipio = `
      INSERT INTO Municipio (id, estado_id, nome, populacao) 
      VALUES (?, ?, ?, ?) 
      ON CONFLICT(id) DO UPDATE SET 
        estado_id = excluded.estado_id, 
        nome = excluded.nome, 
        populacao = excluded.populacao;
    `;  
    await db.exec("BEGIN TRANSACTION");
    for (const municipio of municipios) {
      const estadoId = municipio.microrregiao.mesorregiao.UF.id;
      await db.run(insertMunicipio, [
        municipio.id,
        estadoId,
        municipio.nome,
        municipio.serie[`${ano}`],
      ]);
    }
    await db.exec("COMMIT");
    console.log("Municípios inseridos com sucesso.");
  } catch (error) {
    console.error("Erro ao buscar ou inserir municípios:", error);
  }
}

export async function populateDatabase(ano) {
  await fetchAndStoreEstados();
  await fetchAndStoreMunicipios(ano);
}

export async function getAllStates() {
  const db = await openDb();
  const query = `
        SELECT *
        FROM 
            estado;
    `;
  return db.all(query);
}

export async function getCityByState(estado) {
  const db = await openDb();
  const query = `
        SELECT * 
        FROM 
            municipio
        WHERE estado_id = ?;
    `;
  return db.all(query, [estado]);
}
