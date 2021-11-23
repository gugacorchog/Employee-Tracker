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
    console.log("\nConnected to the employee_db database\n"),
    console.log("********************************"),
    console.log("*                              *"),
    console.log("*       EMPLOYEE TRACKER       *"),
    console.log("*                              *"),
    console.log("********************************\n"),
);
// Init function and load menu (menu.js)
function init() {
    loadMainMenu()
}

function findId(targetString, valuesArray) {
    const targetValue = valuesArray.find(value => value.name === targetString);
    return targetValue.id;
}
// Menu Option VIEW_ALL_DEPARTMENTS, VIEW_ALL_ROLE, VIEW_ALL_EMPLOYEE, ADD_OPTIONS, UPDATE_OPTIONS, DELETE_OPTIONS
function loadMainMenu() {
    inquirer.prompt(menuQuestions)
    .then(res => {
        switch(res.choice) {
          case "VIEW_ALL_DEPARTMENTS":
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
          case "UPDATE_OPTIONS":
          update()
          break;
          case "DELETE_OPTIONS":
            deleteOp()
           break;   
        }
      }
    )}
//////// VIEW_ALL_DEPARTMENTS ////////
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
//////// VIEW_ALL_ROLE ////////
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
///////// VIEW_ALL_EMPLOYEE ///////// 
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
//////// ADD_OPTIONS ////////
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
//////// UPDATE_OPTIONS ////////
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
//////// DELETE_OPTIONS ////////
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
                    ]) 
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
                    }) 
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
                          
                        }
                        return list;
                    }
                }
            ])
            .then((answer) => {
                // console.log(answer);
                const role_id = findId(answer.role, roleObj);
                const manager_id = findId(answer.manager, employeeObj);
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
    const update = () => {
        inquirer
            .prompt({
                name: 'update',
                type: 'list',
                message: 'Update Employee option',
                choices: ['Employee Role', 'Employee Manager', 'Back']
            })
            .then((chosen) => {
                switch(chosen.update) {
                    case 'Employee Role':
                        updateEmployeeRole();
                    break;
                    case 'Employee Manager':
                        updateEmployeeManager();
                    break;
                    default:
                        loadMainMenu();
                }
            })
            .catch(err => err);
    }
    const updateEmployeeRole = () => {
        connection.query(IdEmployeeName, function(err, res) {
            if(err) throw err;
            inquirer
                .prompt({
                    name: 'employee',
                    type: 'rawlist',
                    message: 'choose employee to update role',
                    choices: () => {
                        const list = [];
                        for(let i = 0; i < res.length; i++) {
                            list.push(res[i]);
                        }
                        return list;
                    }
                })
                .then((chosen) => {
                    const employeeId = findId(chosen.employee, res);
                    connection.query(`SELECT id, title AS 'name' FROM role`, function(err, res) {
                        if(err) throw err;
                        inquirer
                            .prompt({
                                name: 'role',
                                type: 'rawlist',
                                message: 'choose role to update',
                                choices: () => {
                                    const list = [];
                                    for(let i = 0; i < res.length; i++) {
                                        list.push(res[i]);
                                    }
                                    return list;
                                }
                            }).then((chosen) => {
                                console.log(chosen);
                                const roleId = findId(chosen.role, res);
                                console.log(roleId);
                                    connection.query(`
                                        UPDATE employee
                                        SET role_id = ?
                                        WHERE id = ?;
                                        `, [roleId ,employeeId], function(err, res) {
                                            if(err) throw err;
                                            console.log('updated employee');
                                            loadMainMenu();
                                    })
                            }).catch(err => err);
                    }); 
                }) 
                .catch(err => err);
        });
    
    }
    const updateEmployeeManager = () => {
        connection.query(IdEmployeeName, function(err, res) {
            if(err) throw err;
            inquirer
                .prompt({
                    name: 'employee',
                    type: 'rawlist',
                    message: 'choose employee to update manager',
                    choices: () => {
                        const list = [];
                        for(let i = 0; i < res.length; i++) {
                            list.push(res[i]);
                        }
                        return list;
                    }
                })
                .then((chosen) => {
                    const employeeId = findId(chosen.employee, res);
                    connection.query(IdEmployeeName, function(err, res) {
                        if(err) throw err;
                        inquirer
                            .prompt({
                                name: 'manager',
                                type: 'rawlist',
                                message: 'choose manager to update',
                                choices: () => {
                                    const list = [];
                                    for(let i = 0; i < res.length; i++) {
                                        list.push(res[i]);
                                    }
                                    return list;
                                }
                            }).then((chosen) => {
                                // console.log(chosen);
                                const managerId = findId(chosen.manager, res);
                                // console.log(managerId);
                                    connection.query(`
                                        UPDATE employee
                                        SET manager_id = ?
                                        WHERE id = ?;
                                        `, [managerId ,employeeId], function(err, res) {
                                            if(err) throw err;
                                            console.log('updated employee');
                                            loadMainMenu();
                                    })
                            }).catch(err => err);
                    }); 
                }) 
                .catch(err => err);
        });
    }
    const deleteOp = () => {
        inquirer
            .prompt({
                name: 'delete',
                type: 'list',
                message: 'Remove data option',
                choices: ['Department', 'Role', 'Employee', 'Back']
            })
            .then((chosen) => {
                switch(chosen.delete) {
                    case 'Department':
                        deleteDepartment();
                    break;
                    case 'Role':
                        deleteRole();
                    break;
                    case 'Employee':
                        deleteEmployee();
                    break;
                    default:
                        loadMainMenu();
                }
    
            })
            .catch((err) => err);
    }
    const deleteDepartment = () => {
        connection.query(`SELECT * FROM department`,
        function(err, res) {
            if(err) throw err;
            inquirer
            .prompt({
                name: 'name',
                type: 'rawlist',
                message: 'Select the department to remove',
                choices: () => {
                    const list = [];
                    for(let i = 0; i < res.length; i ++) {
                        list.push(res[i]);
                    }
                    return list;
                }
            }).then((chosen) => {
                const departmentId = findId(chosen.name, res);
                connection.query(`
                    DELETE FROM department WHERE id = ?
                    `,departmentId ,function(err, res) {
                        if(err) throw err;
                        console.log('deleted department');
                        loadMainMenu();
                });
            }).catch(err => err);
        });
    
    }
    const deleteRole = () => {
        connection.query(`SELECT id, title AS 'name' FROM role`,
            function(err, res){
                if(err) throw err;
                inquirer
                    .prompt({
                        name: 'title',
                        type: 'rawlist',
                        message: 'Select role to remove',
                        choices: async () => {
                            const list = [];
                            for(let i = 0; i < res.length; i++) {
                                list.push(res[i]);
                            }
                            return list;
                        }
                    })
                    .then((chosen) => {
                        console.log(chosen);
                        const roleId = findId(chosen.title, res);
                        console.log(roleId);
                        connection.query(`
                        DELETE FROM role WHERE id = ?
                        `,roleId ,function(err, res) {
                            if(err) throw err;
                            console.log('deleted role');
                            loadMainMenu();
                        });
    
                    }) 
                    .catch(err => err);
            });
    }
    const deleteEmployee = () => {
        connection.query(IdEmployeeName, function(err, res) {
            if(err) throw err;
            inquirer
                .prompt({
                    name: 'name',
                    type: 'rawlist',
                    message: 'Select employee to delete',
                    choices: () => {
                        const list = [];
                        for(let i = 0; i < res.length; i++) {
                            list.push(res[i].name);
                        }
                        return list;
                    }
                }).then((chosen) => {
                    console.log(chosen);
                    const employeeId = findId(chosen.name, res);
                    connection.query(`
                    DELETE FROM employee WHERE id = ?
                    `,employeeId , function(err, res) {
                        if(err) throw err;
                        if(res) console.log('delete employ successed');
                        loadMainMenu();
                    });
                }).catch((err) => err);
        });
    }
    

    const IdEmployeeName = `SELECT id, CONCAT(first_name, ' ', last_name) AS 'name' FROM employee`;
    const roleObj = [];
    const employeeObj = [];

    init()
