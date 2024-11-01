import { openDb } from "../config/configDB.js";

export async function configDatabase() {
    openDb().then(db => {
        db.exec('PRAGMA foreign_keys = ON;');
    })
}