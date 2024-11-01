import { openDb } from "../config/configDB.js";

export async function createTableMunicipio() {
    openDb().then(db => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS municipio (
                id INTEGER PRIMARY KEY,
                estado_id INTEGER,
                nome TEXT,
                populacao INTEGER,
                FOREIGN KEY (estado_id) REFERENCES Estado(id)
            );
        `);
    });
}
