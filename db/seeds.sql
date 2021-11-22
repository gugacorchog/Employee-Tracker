USE employee_db;
INSERT INTO department (name)
 VALUES ("Engineering"),
        ("Finance"),    
		("Legal"),
		("Sales");
		


INSERT INTO role (title, salary, department_ID) 
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 80000, 1),
       ("Accountant Mananger", 160000, 2),
       ("Accountant", 65000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);


INSERT INTO employee (first_name, last_name, role_ID, manager_ID) 
VALUES  ("Joel", "Doe", 1, NULL ),
		("Mike", "Chan", 2, 1),
		("Ashley", "Rodrigues", 3, NULL),
		("Kevin", "Tupik", 4, 3),
		("Kunal", "Singh", 5, NULL),
		("Malia", "Brown", 6, 5),
		("Sarah", "Lourd", 7, NULL),
		("Tom", "Allen", 8, 7);
        
