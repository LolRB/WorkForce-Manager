# WorkForce-Manager

## Overview

WorkForce-Manager is a command-line tool designed with Node.js, Inquirer, and PostgreSQL to help business owners effectively oversee their employee records. This tool provides a user-friendly interface for interacting with your company's employee data, including details on departments, job roles, and employees.

## Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Features](#features)
- [Database Schema](#database-schema)
- [Credits](#credits)

## Getting Started

To launch the application, use the following command in your terminal:

```bash
node index.js
```

The application will present a menu with various options to manage your company's data. You can view all departments, roles, and employees, as well as add or update records as needed.

## Features

- View Departments: Lists all departments with their names and IDs.
- View Roles: Displays roles with details such as title, role ID, department, and salary.
- View Employees:Shows employee information including IDs, names, job titles, departments, salaries, and managers.
- Add Department: Prompts you to enter a department name and adds it to the database.
- Add Role: Allows you to input a role title, salary, and department, then saves it to the database.
- Add Employee: Prompts for an employee's name, role, and manager, and adds this information to the database.
- Update Employee Role: Lets you select an employee and assign a new role, updating the database accordingly.

## Database Schema

The database schema consists of three main tables:

1. Department

   - `id`: SERIAL PRIMARY KEY
   - `name`: VARCHAR(30) UNIQUE NOT NULL

2. Role

   - `id`: SERIAL PRIMARY KEY
   - `title`: VARCHAR(30) UNIQUE NOT NULL
   - `salary`: DECIMAL NOT NULL
   - `department_id`: INTEGER NOT NULL (References `department.id`)

3. Employee

   - `id`: SERIAL PRIMARY KEY
   - `first_name`: VARCHAR(30) NOT NULL
   - `last_name`: VARCHAR(30) NOT NULL
   - `role_id`: INTEGER NOT NULL (References `role.id`)
   - `manager_id`: INTEGER (References `employee.id`)

## Credits

This project was developed as a learning exercise and may feature basic implementations.