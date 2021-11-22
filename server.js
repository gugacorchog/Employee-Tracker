const inquirer = require('inquirer')
const mysql = require('mysql2');
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
          case "ADD_OPTIONS":
          add()
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
               
    };

    const add = () => {
    inquirer
        .prompt({
            name: 'add',
            type: 'list',
            message: 'What data you want to add?',
            choices: ['Department', 'Role', 'Employee', 'Back']
        })
        .then((chosen) => {
            switch(chosen.add) {
                case 'Department':
                    addDepartment();
                break;
                case 'Role':
                    addRole();
                break;
                case 'Employee':
                    addEmployee();
                break;
                default:
                    loadMainMenu();
            }
        });
    }

    const addDepartment = () => {
        inquirer
            .prompt({
                name: 'name',
                type: 'input',
                message: 'deparment name'
            })
            .then((input) => {
                connection.query(`
                    INSERT INTO department (name)
                    VALUES (?)
                    `, input.name ,function(err, res) {
                    if(err) throw err;
                    console.log('add department successed');
                    loadMainMenu();
                });
    
            });
    }

    const addRole = () => {
        connection.query(`SELECT * FROM department`,
            function(err, res) {
                if(err) throw err;
                inquirer
                    .prompt([
                        {
                            name: 'title',
                            type: 'input',
                            message: 'role title'
                        },
                        {
                            name: 'salary',
                            type: 'number',
                            message: 'role salary'
                        },
                        {
                            name: 'department_name',
                            type: 'rawlist',
                            message: 'department',
                            choices: () => {
                                const list = [];
                                for(let i = 0; i < res.length; i++) {
                                    list.push(res[i].name);
                                }
                                return list;
                                }
                        }
                    ]) // prompt end
                    .then((answer) => {
                        // console.log(answer);
                        const department_id = findId(answer.department_name, res);
                        connection.query(`
                            INSERT INTO role (title, salary, department_id)
                            VALUES(?,?,?)
                            `,[answer.title, answer.salary, department_id],
                            function(err, res) {
                                if(err) throw err;
                                console.log('add role successed');
                            });
                            loadMainMenu();
                    }) //then
                    .catch(err => err);
                });
    }
    const addEmployee = () =>{
        findRole();
        findEmployee();
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Employee\'s first name'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Employee\'s last name'
                },
                {
                    name: 'role',
                    type: 'rawlist',
                    message: 'employee role',
                    choices: () => {
                        const list = [];
                        for(let i = 0; i < roleObj.length; i++) {
                            list.push(roleObj[i].name);
                            // console.log(list);
                        }
                        return list;
                    }
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    message: 'employee manager',
                    choices: () => {
                        employeeObj.push('null');
                        const list = [];
                        for(let i = 0; i < employeeObj.length; i++) {
                            list.push(employeeObj[i]);
                            // console.log(list);
                        }
                        return list;
                    }
                }
            ])
            .then((answer) => {
                // console.log(answer);
                const role_id = findId(answer.role, roleObj);
                const manager_id = findId(answer.manager, employeeObj);
                // console.log('role: ' + role_id + '\nm: ' + manager_id)
                connection.query(`
                    INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ? , ?)
                    `,[answer.first_name ,answer.last_name ,role_id , manager_id] ,function (err, res) {
                        if(err) throw err;
                        console.log('add employee successed');
                        return loadMainMenu();
                        
                    });
            }).catch(err => err);
    }
    const findRole = () => {
        connection.query(`SELECT id, title AS 'name' FROM role`,
            function(err, res){
                if(err) throw err;
                for(let i = 0; i < res.length ;i++) {
                    roleObj.push(res[i]);
                }
                return roleObj;
            });
    }
    const findEmployee = () => {
        connection.query(IdEmployeeName, function(err, res) {
            if(err) throw err;
            for(let i = 0; i< res.length ; i++) {
                employeeObj.push(res[i]);
            }
            return employeeObj;
        });
    }
    const IdEmployeeName = `SELECT id, CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`;
    const roleObj = [];
    const employeeObj = [];

    init()
