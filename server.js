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
            choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
        }
    ])
    .then(answer => {
        if(answer == 'View all Departments'){
            viewAllDepartments();
        }else if (answer == 'View all Roles'){
            viewAllRoles();
        }else if (answer == 'View all Employees'){
            viewAllEmployees();
        }else if (answer == 'Add a Department'){
            addADepartment();
        }else if (answer == 'Add a Role'){
            addARole();
        }else if (answer == 'Add an Employee'){
            addAnEmployee();
        }else if (answer == 'Update an Employee Role'){
            updateAnEmployeeRole();
        }
    })
};