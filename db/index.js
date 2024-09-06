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
    return this.runQuery(query, [
      first_name,
      last_name,
      position_id,
      manager_ref,
    ]);
  }

  deleteEmployee(employeeId) {
    const query = "DELETE FROM employees WHERE employees_id = $1;";
    return this.runQuery(query, [employeeId]);
  }

  changeEmployeeRole(employeeId, roleId) {
    const query =
      "UPDATE employees SET position_id = $1 WHERE employees_id = $2;";
    return this.runQuery(query, [roleId, employeeId]);
  }

  changeEmployeeManager(employeeId, managerId) {
    const query =
      "UPDATE employees SET manager_ref = $1 WHERE employees_id = $2;";
    return this.runQuery(query, [managerId, employeeId]);
  }

  getAllRoles() {
    const query = `
      SELECT 
        r.roles_id AS id, r.roles_title AS title, d.departments_name AS department, r.roles_salary AS salary 
      FROM roles r
      LEFT JOIN departments d ON r.dept_id = d.departments_id;
    `;
    return this.runQuery(query);
  }

  addRole({ roles_title, roles_salary, dept_id }) {
    const query = `
      INSERT INTO roles (roles_title, roles_salary, dept_id) 
      VALUES ($1, $2, $3);
    `;
    return this.runQuery(query, [roles_title, roles_salary, dept_id]);
  }

  deleteRole(roleId) {
    const query = "DELETE FROM roles WHERE roles_id = $1;";
    return this.runQuery(query, [roleId]);
  }

  getAllDepartments() {
    const query =
      "SELECT departments_id AS id, departments_name AS name FROM departments;";
    return this.runQuery(query);
  }

  getDepartmentBudgets() {
    const query = `
      SELECT 
        d.departments_id AS id, d.departments_name AS name, 
        SUM(r.roles_salary) AS utilized_budget 
      FROM employees e
      LEFT JOIN roles r ON e.position_id = r.roles_id 
      LEFT JOIN departments d ON r.dept_id = d.departments_id 
      GROUP BY d.departments_id, d.departments_name;
    `;
    return this.runQuery(query);
  }

  addDepartment({ departments_name }) {
    const query = "INSERT INTO departments (departments_name) VALUES ($1);";
    return this.runQuery(query, [departments_name]);
  }

  deleteDepartment(departmentId) {
    const query = "DELETE FROM departments WHERE departments_id = $1;";
    return this.runQuery(query, [departmentId]);
  }

  getEmployeesByDepartment(departmentId) {
    const query = `
      SELECT 
        e.employees_id AS id, e.first_name, e.last_name, 
        r.roles_title AS title 
      FROM employees e
      LEFT JOIN roles r ON e.position_id = r.roles_id 
      LEFT JOIN departments d ON r.dept_id = d.departments_id 
      WHERE d.departments_id = $1;
    `;
    return this.runQuery(query, [departmentId]);
  }

  getEmployeesByManager(managerId) {
    const query = `
      SELECT 
        e.employees_id AS id, e.first_name, e.last_name, 
        d.departments_name AS department, r.roles_title AS title 
      FROM employees e
      LEFT JOIN roles r ON e.position_id = r.roles_id 
      LEFT JOIN departments d ON r.dept_id = d.departments_id 
      WHERE e.manager_ref = $1;
    `;
    return this.runQuery(query, [managerId]);
  }
}

export default new Database();
