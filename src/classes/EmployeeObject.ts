import { IEmployee } from "../redux/type";

class EmployeeObject implements IEmployee {

    public id: string = "";
    public employee_name: string = "";
    public employee_salary: string = "";
    public employee_age: string = "";
    public profile_image: string = "";

    constructor(employeeObject?: IEmployee) {
        if(employeeObject) {
            this.id = employeeObject.id;
            this.employee_name = employeeObject.employee_name;
            this.employee_salary= employeeObject.employee_salary;
            this.employee_age= employeeObject.employee_age;
            this.profile_image= employeeObject.profile_image;
        }
    }
}

export default EmployeeObject;