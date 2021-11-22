const inquirer = require('inquirer')
const mysql = require('mysql2');
const menuChoices = require('./models/menu');
const menuQuestions = require('./models/menu');

const connection = mysql.createConnection(
{
    host: "localhost",

    user: "root",

    password: "",
    database: "employee_db"

},
    console.log(`Connected to the employee_db database.`)
);

// THEN I am presented with the following options: 
// view all departments, presented with a formatted table 
// showing department names and department ids ( From seeds.sql)

function init() {
    loadMainMenu()
}

function loadMainMenu() {
    inquirer.prompt(menuQuestions)
    .then(res => {
        switch(res.choice) {
          case "VIEW_ALL_DEPARTMENTS":
          // call view all employees function
          viewAllDepartments()
          break;
          case "VIEW_ALL_ROLE":
          viewAllRole()
          break;
          case "VIEW_ALL_EMPLOYEE":
          viewAllEmployee()
          break;  
        }
      }
    )}

      function viewAllDepartments() {
        connection.promise().query(
          "SELECT department.id, department.name FROM department;"
        ) // tell database to select or insert
        .then(([rows]) => {
          let departments = rows;
          console.log("\n"); // add new line
          console.table(departments); // display results
        })
        .then(() => loadMainMenu()); // call loadMainMenu function to return start of questions
    }
        function viewAllRole() {
           connection.promise().query(
                "SELECT title, salary, department_ID FROM role;"
            )
            .then(([rows]) => {
                let role = rows;
                console.log("\n"); // add new line
                console.table(role);
            })    
            .then(() => loadMainMenu());
            
    }
        function viewAllEmployee() {
            connection.promise().query(
                 "SELECT first_name, last_name, role_ID, manager_ID FROM employee;"
             )
             .then(([rows]) => {
                 let employee = rows;
                 console.log("\n"); // add new line
                 console.table(employee);
             })    
             .then(() => loadMainMenu());    

    init()


// view all roles, presented with the job title, role id, the department that role belongs to, and the salary for that role
// view all employees, presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// add a department, prompted to enter the name of the department and that department is added to the database
// add a role, prompted to enter the name, salary, and department for the role and that role is added to the database
// add an employee, prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// and update an employee role, prompted to select an employee to update and their new role and this information is updated in the database
