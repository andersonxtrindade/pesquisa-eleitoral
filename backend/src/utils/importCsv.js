import fs from 'fs';
import csv from 'csv-parser';
import { openDb } from "../config/configDB.js";

export async function importCsv(filePath) {
    const db = await openDb();

    const insertPesquisa = `INSERT INTO Pesquisa (data, municipio, estado, intencao_voto) VALUES (?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (data) => {
                try {
                    await db.run(insertPesquisa, [data.DATA_PESQUISA, data.MUNICÍPIO, data.ESTADO, data['INTENÇÃO DE VOTO']]);
                } catch (error) {
                    console.error("Erro ao inserir dados:", error);
                    reject(error);
                }
            })
            .on('end', () => {
                console.log('Pesquisas enviadas com sucesso!');
                resolve(); 
            })
            .on('error', (error) => {
                console.error("Erro ao processar o arquivo CSV:", error);
                reject(error);
            });
    });
}
