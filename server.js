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
  