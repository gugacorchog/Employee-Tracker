const menuQuestions = {

        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          {
             name: "View_all_departments",
             value: "VIEW_ALL_DEPARTMENTS"
          },
          {
             name: "View_all_role",
             value: "VIEW_ALL_ROLE"
          },
          {
            name: "View_all_employee",
            value: "VIEW_ALL_EMPLOYEE"
         },
         {
            name: "ADD_OPTIONS",
            value: "ADD_OPTIONS",
         }  
        ]
      }
 
module.exports = menuQuestions;