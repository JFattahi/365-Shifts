export function up(knex) {
  return knex.schema
    .createTable('employees', (table) => {
      table.increments('id').primary();
      table.string('code', 4).notNullable().unique();
      table.string('first_name', 50).notNullable();
      table.string('last_name', 50).notNullable();
      table.string('title', 50).notNullable();
    })
    .createTable('shifts', (table) => {
      table.increments('id').primary();
      table.integer('employee_id').unsigned().notNullable();
      table.timestamp('punch_in').notNullable();
      table.timestamp('punch_out').nullable();
      table.foreign('employee_id').references('employees.id');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('shifts')
    .dropTable('employees');
} 