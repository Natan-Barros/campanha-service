import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('campanhas', (table) => {
        table.uuid('id').primary();
        table.text('nome').notNullable();
        table.timestamp('dataCadastro').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('dataInicio').notNullable();
        table.timestamp('dataFim').notNullable();
        table.text("status").notNullable();
        table.text("categoria").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("campanhas");
}

