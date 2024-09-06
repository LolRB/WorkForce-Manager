DROP DATABASE IF EXISTS company;

CREATE DATABASE company;

\connect company

CREATE TABLE departments (
  departments_id SERIAL PRIMARY KEY,
  departments_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE roles (
  roles_id SERIAL PRIMARY KEY,
  roles_title VARCHAR(50) NOT NULL UNIQUE,
  roles_salary NUMERIC NOT NULL,
  dept_id INTEGER NOT NULL,
  CONSTRAINT fk_dept FOREIGN KEY (dept_id) REFERENCES departments(departments_id) ON DELETE CASCADE
);

CREATE TABLE employees (
  employees_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_ref INTEGER,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(roles_id) ON DELETE CASCADE,
  CONSTRAINT fk_manager_ref FOREIGN KEY (manager_ref) REFERENCES employees(employees_id) ON DELETE SET NULL
);
