import pool from "./connection.js";

class Database {
  async runQuery(queryText, parameters = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(queryText, parameters);
      return result;
    } finally {
      client.release();
    }
  }

  getAllEmployees() {
    const query = `
      SELECT 
        e.employees_id AS id, e.first_name, e.last_name, 
        r.roles_title AS title, d.departments_name AS department, r.roles_salary AS salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager 
      FROM employees e
      LEFT JOIN roles r ON e.position_id = r.roles_id 
      LEFT JOIN departments d ON r.dept_id = d.departments_id 
      LEFT JOIN employees m ON e.manager_ref = m.employees_id;
    `;
    return this.runQuery(query);
  }

  getPotentialManagers(excludeId) {
    const query = `
      SELECT employees_id AS id, first_name, last_name 
      FROM employees 
      WHERE employees_id != $1;
    `;
    return this.runQuery(query, [excludeId]);
  }

  addEmployee({ first_name, last_name, position_id, manager_ref }) {
    const query = `
      INSERT INTO employees (first_name, last_name, position_id, manager_ref) 
      VALUES ($1, $2, $3, $4);
    `;
    return this.runQuery(query, [first_name, last_name, position_id, manager_ref]);
  }
}

export default new Database();
