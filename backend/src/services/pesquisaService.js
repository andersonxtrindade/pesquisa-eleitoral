import csv from "csv-parser";
import { openDb } from "../config/configDB.js";
import { Readable } from "stream";
import iconv from "iconv-lite";

export async function importCsv(fileBuffer) {
  const db = await openDb();

  const insertPesquisa = `INSERT INTO pesquisa_eleitoral (id_pesquisa, data_pesquisa, municipio, estado, intencao_voto) VALUES `;

  return new Promise((resolve, reject) => {
    const decodedBuffer = iconv.decode(fileBuffer, "windows-1252");
    const readableStream = Readable.from(decodedBuffer);

    const records = [];

    readableStream
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => {
        records.push([
          data.ID_PESQUISA,
          data.DATA_PESQUISA,
          data.MUNICÍPIO,
          data.ESTADO,
          data["INTENÇÃO DE VOTO"],
        ]);
      })
      .on("end", async () => {
        try {
          if (records.length === 0) {
            console.log("Nenhum registro encontrado para inserir.");
            resolve();
            return;
          }

          const placeholders = records.map(() => "(?, ?, ?, ?, ?)").join(", ");
          const values = records.flat();

          const sql = insertPesquisa + placeholders;

          await db.run(sql, values);
          console.log("Pesquisas enviadas com sucesso!");
          resolve();
        } catch (error) {
          console.error("Erro ao inserir dados:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Erro ao processar o arquivo CSV:", error);
        reject(error);
      });
  });
}

export async function getFilteredPesquisas({ id_pesquisa, municipio, estado }) {
    const db = await openDb();
    let query = `
        WITH VotosPonderados AS (
            SELECT 
                pe.id_pesquisa,
                pe.intencao_voto,
                COUNT(pe.intencao_voto) AS votos_reais,
                SUM(CASE 
                    WHEN m.populacao <= 20000 THEN 1   
                    WHEN m.populacao BETWEEN 20001 AND 100000 THEN 2  
                    WHEN m.populacao BETWEEN 100001 AND 1000000 THEN 5 
                    ELSE 10 
                END) AS votos_ponderados
            FROM 
                pesquisa_eleitoral pe
            JOIN 
                estado e ON pe.estado = e.sigla
            JOIN 
                municipio m ON pe.municipio = m.nome AND e.id = m.estado_id
            WHERE 
                pe.intencao_voto != "#N/D"
    `;

    const params = [];
    
    if (id_pesquisa) {
        query += ' AND pe.id_pesquisa = ?';
        params.push(id_pesquisa);
    }
    if (municipio) {
        query += ' AND pe.municipio = ?';
        params.push(municipio);
    }
    if (estado) {
        query += ' AND pe.estado = ?';
        params.push(estado);
    }

    query += `
            GROUP BY 
                pe.id_pesquisa, pe.intencao_voto
        )
        SELECT 
            intencao_voto,
            SUM(votos_reais) AS votos_reais,
            SUM(votos_ponderados) AS votos_ponderados,
            (SUM(votos_ponderados) * 100.0 / NULLIF(SUM(SUM(votos_ponderados)) OVER (), 0)) AS porcentagem_ponderada,
            (SUM(votos_reais) * 100.0 / NULLIF(SUM(SUM(votos_reais)) OVER (), 0)) AS porcentagem_real
        FROM 
            VotosPonderados
        GROUP BY 
            intencao_voto
        ORDER BY 
            intencao_voto;
    `;

    return db.all(query, params);
}

export async function getAllPesquisasIds() {
  const db = await openDb();
  const query = `
        SELECT DISTINCT 
            id_pesquisa
        FROM 
            pesquisa_eleitoral;
    `;
  return db.all(query);
}
