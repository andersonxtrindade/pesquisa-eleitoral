import { configDatabase } from "./ConfigDatabase.js";
import { createTableEstado } from "./Estado.js";
import { createTableMunicipio } from "./Municipio.js"; 
import { createTablePesquisa } from "./Pesquisa.js";

export function initializeModels() {
    configDatabase();
    createTableEstado();
    createTableMunicipio(); 
    createTablePesquisa();
}
