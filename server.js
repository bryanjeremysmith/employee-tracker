const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      password: 'pass1234',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});


const mainPrompt = () => {
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "What would you like to do?",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
    ])
    .then(answer => {
        if (answer == 'View all Employees'){
            viewAllEmployees();
        }else if (answer == 'Add Employee'){
            addEmployee();
        }else if (answer == 'Update Employee Role'){
            updateEmployeeRole();
        }else if (answer == 'View All Roles'){
            viewAllRoles();
        }else if (answer == 'Add Role'){
            addRole();
        }else if(answer == 'View All Departments'){
            viewAllDepartments();
        }else if (answer == 'Add Department'){
            addDepartment();
        }else{
            quit();
        }
    })
};

viewAllEmployees = () => {
    db.query(`SELECT employee.id, first_name AS "First Name", last_name AS "Last Name", title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, department.name FROM employee 
    INNER JOIN role ON employee.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    ORDER BY last_name ASC`, (err, res) => {
        console.table(res);
        mainPrompt();
    });
}

addEmployee = () => {
    db.query("SELECT * from role"), (err, res) => {
        let listOfRoles = res.map(role => (
            {
                name: role.id,
                value: role.title
            }
        ));

        db.query("SELECT * from employee WHERE manager_id is NULL"), (err, res) => {
            let listOfManagers = res.map(manager => (
                {
                    name: manager.id,
                    value: manager.first_name + ' ' + manager.last_name
                }
            ));
            listOfManagers.unshift('None');
            inquirer.prompt ([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: [listOfRoles]
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Who is the employee's manager?",
                    choices: [listOfManagers]
                }
            ]).then((answers) => {
                db.query("INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.role.value,
                        manager_id: answer.manager_id.value
                    },
                    (err, res) => {
                        console.log('Added ' + answer.first_name + ' ' + asnwer.last_name + ' to the database');
                    });
                    mainPrompt();
            });
        };
    };
}

updateEmployeeRole = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if(err)
        {
            console.error(err);
        }
        else
        {
            let listOfEmployees = res.map(employee => (
                {
                    name: employee.id,
                    value: employee.last_name + ' ' + employee.last_name
                }
            ));
            listOfEmployees.unshift('None');
            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?",
                    choices: [listOfEmployees]
                }
            ]).then((employee) => {
                db.query('SELECT * from role', (err, res) => {
                    if(err)
                    {
                        console.error(err);
                    }
                    else
                    {
                        let listOfRoles = res.map(role => (
                            {
                                name: role.title,
                                value: role.id
                            }
                        ))
                        inquirer.prompt ([
                            {
                                type: 'list',
                                name: 'role',
                                message: "Which role do you want to assign the selected employee?",
                                choices: [listOfRoles]
                            }
                        ]).then((role) => {

                            db.query('UPDATE employee SET role_id = ? WHERE id = ?', employee.value, role.value, (err, res) => {
                                console.log(`Updated employee's role`);
                            });
                            
                            mainPrompt();
                        });
                    }
                });
            });
        }
    });
}

viewAllRoles = () => {
    db.query(`SELECT roles.id AS role_id, roles.title AS Title, salary AS Salary, departments.name AS department FROM roles 
    INNER JOIN departments ON roles.dept_id = departments.dept_id 
    ORDER BY roles.role_id ASC`, (err, res) => {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.table(res);
        }
        mainPrompt();
    });
}

addRole = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if(err)
        {
            console.error(err);
        }
        else
        {
            let listOfDepartments = res.map(department => (
                {
                    name: department.id,
                    value: department.name
                }
            ));

            inquirer.prompt ([
                {
                    type: 'input',
                    name: 'role',
                    message: "What is the name of the role?",
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "What is the salary of the role?",
                },
                {
                    type: 'list',
                    name: 'department',
                    message: "Which department does the role belong to?",
                    choices: [listOfDepartments]
                }
            ]).then((answers) => {
                console.log('Added ${customer service} to the database.');
            });
        }
        mainPrompt();
    });
}

viewAllDepartments = () => {
    db.query('SELECT id AS department_id, departments.name AS department_name FROM departments', (err, res) => {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.table(res);
        }
        mainPrompt();
    });
}

addDepartment = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'department',
            message: "What is the name of the department?",
        }
    ]).then((answers) => {
        db.query('INSERT INTO department SET ?', answers.department, (err, res) => {
            if(err)
            {
                console.error(err);
            }
            else
            {
                console.log('Added ${input} to the database');
            }
        });
    });
    mainPrompt();
}

quit = () => {
    db.quit();
    console.log('Thanks for using the Employee Database!');
}