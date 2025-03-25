import knex from "knex";
import config from "./knexfile";

const knexConfig = config["development"];
console.log("NODE_ENV definido como:", process.env.NODE_ENV);
console.log("Config selecionada:", knexConfig);
const db = knex(knexConfig);

export default db;