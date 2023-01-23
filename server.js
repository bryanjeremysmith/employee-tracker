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
    db.query(`SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, departments.name AS Department FROM employees 
    INNER JOIN roles ON employees.role_Id = roles.role_id 
    INNER JOIN departments ON roles.dept_id = departments.dept_id 
    ORDER BY last_name ASC`, (err, res) => {
        console.table(res);
        mainPrompt();
    });
}

addEmployee = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
        }
    ]),
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
        }
    ]),
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            //TODOBJS query the database
            choices: ['Sales Lead', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service']

        }
    ]),
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "Who is the employee's manager?",
            //TODOBJS query the database
            choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown']

        }
    ]),

    'Added ${first_name} ${last_name} to the database';
}

updateEmployeeRole = () => {

    return inquirer.prompt ([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            //TODOBJS query the database
            choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown']

        }
    ]),
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "Which role do you want to assign the selected employee?",
            //TODOBJS query the database
            choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown']

        }
    ])

    `Update employee's role`
}

viewAllRoles = () => {
    db.query(`SELECT roles.id AS role_id, roles.title AS Title, salary AS Salary, departments.name AS department FROM roles 
    INNER JOIN departments ON roles.dept_id = departments.dept_id 
    ORDER BY roles.role_id ASC`, (err, res) => {
        console.table(res);
        mainPrompt();
    });
}

addRole = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'role',
            message: "What is the name of the role?",
        }
    ]),
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of the role?",
        }
    ]),
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'department',
            message: "Which department does the role belong to?",
            //TODOBJS query the database
            choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
        }
        'Added ${customer service} to the database.'
    ]),
}

viewAllDepartments = () => {
    db.query('SELECT id AS department_id, departments.name AS department_name FROM departments', (err, res) => {
        console.table(res);
        mainPrompt();
    });
}

addDepartment = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'department',
            message: "What is the name of the department?",
        }
    ])

    'Added ${input} to the database '
}

quit = () => {

}