import inquirer from "inquirer";
import logo from "asciiart-logo";
import * as db from "./db/index.js";

// Start the application
initialize();

function initialize() {
  const appLogo = logo({ name: "WorkForce Manager" }).render();
  console.log(appLogo);
  displayMainMenu();
}

function displayMainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do?",
        choices: [
          { name: "Show All Employees", value: "SHOW_EMPLOYEES" },
          {
            name: "Show Employees by Department",
            value: "SHOW_EMPLOYEES_BY_DEPARTMENT",
          },
          {
            name: "Show Employees by Manager",
            value: "SHOW_EMPLOYEES_BY_MANAGER",
          },
          { name: "Add New Employee", value: "ADD_EMPLOYEE" },
          { name: "Delete Employee", value: "DELETE_EMPLOYEE" },
          { name: "Change Employee Role", value: "CHANGE_EMPLOYEE_ROLE" },
          { name: "Change Employee Manager", value: "CHANGE_EMPLOYEE_MANAGER" },
          { name: "Show All Roles", value: "SHOW_ROLES" },
          { name: "Add New Role", value: "ADD_ROLE" },
          { name: "Delete Role", value: "DELETE_ROLE" },
          { name: "Show All Departments", value: "SHOW_DEPARTMENTS" },
          { name: "Add New Department", value: "ADD_DEPARTMENT" },
          { name: "Delete Department", value: "DELETE_DEPARTMENT" },
          {
            name: "Show Budget Utilization by Department",
            value: "SHOW_BUDGET_BY_DEPARTMENT",
          },
          { name: "Exit", value: "EXIT" },
        ],
      },
    ])
    .then((response) => {
      const action = response.selection;
      switch (action) {
        case "SHOW_EMPLOYEES":
          return displayEmployees();
        case "SHOW_EMPLOYEES_BY_DEPARTMENT":
          return displayEmployeesByDepartment();
        case "SHOW_EMPLOYEES_BY_MANAGER":
          return displayEmployeesByManager();
        case "ADD_EMPLOYEE":
          return createEmployee();
        case "DELETE_EMPLOYEE":
          return deleteEmployee();
        case "CHANGE_EMPLOYEE_ROLE":
          return modifyEmployeeRole();
        case "CHANGE_EMPLOYEE_MANAGER":
          return modifyEmployeeManager();
        case "SHOW_DEPARTMENTS":
          return displayDepartments();
        case "ADD_DEPARTMENT":
          return createDepartment();
        case "DELETE_DEPARTMENT":
          return deleteDepartment();
        case "SHOW_BUDGET_BY_DEPARTMENT":
          return displayBudgetByDepartment();
        case "SHOW_ROLES":
          return displayRoles();
        case "ADD_ROLE":
          return createRole();
        case "DELETE_ROLE":
          return deleteRole();
        default:
          return exitApp();
      }
    });
}

function displayEmployees() {
  db.getAllEmployees()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => displayMainMenu());
}

function displayEmployeesByDepartment() {
  db.getAllDepartments().then(({ rows }) => {
    const departments = rows;
    const departmentOptions = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Select a department to view its employees:",
          choices: departmentOptions,
        },
      ])
      .then((response) => db.getEmployeesByDepartment(response.departmentId))
      .then(({ rows }) => {
        console.log("\n");
        console.table(rows);
      })
      .then(() => displayMainMenu());
  });
}

function displayEmployeesByManager() {
  db.getAllEmployees().then(({ rows }) => {
    const managers = rows;
    const managerOptions = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "managerId",
          message: "Select a manager to view their employees:",
          choices: managerOptions,
        },
      ])
      .then((response) => db.getEmployeesByManager(response.managerId))
      .then(({ rows }) => {
        console.log("\n");
        if (rows.length === 0) {
          console.log("No direct reports for the selected manager.");
        } else {
          console.table(rows);
        }
      })
      .then(() => displayMainMenu());
  });
}

function deleteEmployee() {
  db.getAllEmployees().then(({ rows }) => {
    const employees = rows;
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee to remove:",
          choices: employeeOptions,
        },
      ])
      .then((response) => db.removeEmployee(response.employeeId))
      .then(() => console.log("Employee removed successfully."))
      .then(() => displayMainMenu());
  });
}

function modifyEmployeeRole() {
  db.getAllEmployees().then(({ rows }) => {
    const employees = rows;
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee whose role you want to change:",
          choices: employeeOptions,
        },
      ])
      .then((response) => {
        const employeeId = response.employeeId;
        db.getAllRoles().then(({ rows }) => {
          const roles = rows;
          const roleOptions = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "roleId",
                message: "Select the new role for the employee:",
                choices: roleOptions,
              },
            ])
            .then((response) =>
              db.updateEmployeeRole(employeeId, response.roleId)
            )
            .then(() => console.log("Employee role updated successfully."))
            .then(() => displayMainMenu());
        });
      });
  });
}

function modifyEmployeeManager() {
  db.getAllEmployees().then(({ rows }) => {
    const employees = rows;
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee whose manager you want to update:",
          choices: employeeOptions,
        },
      ])
      .then((response) => {
        const employeeId = response.employeeId;
        db.getPotentialManagers(employeeId).then(({ rows }) => {
          const managers = rows;
          const managerOptions = managers.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          inquirer
            .prompt([
              {
                type: "list",
                name: "managerId",
                message: "Select the new manager for the employee:",
                choices: managerOptions,
              },
            ])
            .then((response) =>
              db.updateEmployeeManager(employeeId, response.managerId)
            )
            .then(() => console.log("Employee manager updated successfully."))
            .then(() => displayMainMenu());
        });
      });
  });
}

function displayRoles() {
  db.getAllRoles()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => displayMainMenu());
}

function createRole() {
  db.getAllDepartments().then(({ rows }) => {
    const departments = rows;
    const departmentOptions = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          name: "salary",
          message: "Enter the salary for the new role:",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Select the department for the new role:",
          choices: departmentOptions,
        },
      ])
      .then((role) => {
        db.addRole(role)
          .then(() => console.log(`Role ${role.title} added successfully.`))
          .then(() => displayMainMenu());
      });
  });
}

function deleteRole() {
  db.getAllRoles().then(({ rows }) => {
    const roles = rows;
    const roleOptions = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "roleId",
          message:
            "Select the role to delete (Note: This will also remove associated employees):",
          choices: roleOptions,
        },
      ])
      .then((response) => db.removeRole(response.roleId))
      .then(() => console.log("Role deleted successfully."))
      .then(() => displayMainMenu());
  });
}

function displayDepartments() {
  db.getAllDepartments()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => displayMainMenu());
}

function createDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "Enter the name of the new department:",
      },
    ])
    .then((response) => {
      db.addDepartment(response)
        .then(() =>
          console.log(`Department ${response.name} added successfully.`)
        )
        .then(() => displayMainMenu());
    });
}

function deleteDepartment() {
  db.getAllDepartments().then(({ rows }) => {
    const departments = rows;
    const departmentOptions = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message:
            "Select the department to delete (Note: This will also remove associated roles and employees):",
          choices: departmentOptions,
        },
      ])
      .then((response) => db.removeDepartment(response.departmentId))
      .then(() => console.log("Department deleted successfully."))
      .then(() => displayMainMenu());
  });
}

function displayBudgetByDepartment() {
  db.getDepartmentBudgets()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => displayMainMenu());
}

function createEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        name: "lastName",
        message: "Enter the employee's last name:",
      },
    ])
    .then((response) => {
      const { firstName, lastName } = response;

      db.getAllRoles().then(({ rows }) => {
        const roles = rows;
        const roleOptions = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "roleId",
              message: "Select the employee's role:",
              choices: roleOptions,
            },
          ])
          .then((response) => {
            const roleId = response.roleId;

            db.getAllEmployees().then(({ rows }) => {
              const employees = rows;
              const managerOptions = employees.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );

              managerOptions.unshift({ name: "None", value: null });

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "managerId",
                    message: "Select the employee's manager:",
                    choices: managerOptions,
                  },
                ])
                .then((response) => {
                  const newEmployee = {
                    manager_id: response.managerId,
                    role_id: roleId,
                    first_name: firstName,
                    last_name: lastName,
                  };

                  db.addEmployee(newEmployee)
                    .then(() =>
                      console.log(
                        `Employee ${firstName} ${lastName} added successfully.`
                      )
                    )
                    .then(() => displayMainMenu());
                });
            });
          });
      });
    });
}

function exitApp() {
  console.log("Goodbye!");
  process.exit();
}
