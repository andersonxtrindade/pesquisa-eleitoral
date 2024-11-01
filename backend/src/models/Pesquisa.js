import { openDb } from "../config/configDB.js";

export async function createTablePesquisa() {
    openDb().then(db => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS pesquisa_eleitoral (
                id INTEGER PRIMARY KEY,
                id_pesquisa TEXT,
                data_pesquisa DATE,
                municipio TEXT,
                estado CHAR(2),
                intencao_voto TEXT
            );
        `);
    })
}