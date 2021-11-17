const express = require ('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const mysql = require("mysql");

const connection = mysql.createConnection(
{
    host: "localhost",

    port: 3306,

    user: "root",

    password: "12345",
    database: "employee_db"

},
    console.log(`Connected to the employee_db database.`)
);


// THEN I am presented with the following options: 
// view all departments, presented with a formatted table 
// showing department names and department ids ( From seeds.sql)




// view all roles, presented with the job title, role id, the department that role belongs to, and the salary for that role
// view all employees, presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// add a department, prompted to enter the name of the department and that department is added to the database
// add a role, prompted to enter the name, salary, and department for the role and that role is added to the database
// add an employee, prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// and update an employee role, prompted to select an employee to update and their new role and this information is updated in the database 