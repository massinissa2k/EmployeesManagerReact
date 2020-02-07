import { Action } from "redux";

type IEmployee = {
    id: string;
    employee_name: string;
    employee_salary: string;
    employee_age: string;
    profile_image: string;
};

interface IAction<T> extends Action<EActions> { payload: T }

export { IEmployee, IAction };