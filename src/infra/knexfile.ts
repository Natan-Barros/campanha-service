import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "campanha@123",
      database: "campanhaDb",
    },
    migrations: {
      directory: "./migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;