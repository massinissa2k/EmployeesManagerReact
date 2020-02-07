import { IEmployee, IAction } from "../type";

enum EActions {
    SET_EMPLOYEES,
    EMPLOYEE_REMOVE,
    SET_EMPLOYEE_FOCUS,
    FETCHING_DATAS,
}

function setEmployees(payload: IEmployee[]): IAction<IEmployee[]> {
    return { type: EActions.SET_EMPLOYEES, payload };
}

function employeeRemove(payload: IEmployee[]): IAction<IEmployee[]> {
    return { type: EActions.EMPLOYEE_REMOVE, payload };
}

function setEmployeeFocus(payload: IEmployee[]): IAction<IEmployee[]> {
    return { type: EActions.SET_EMPLOYEE_FOCUS, payload };
}

function setFetchingData(payload: boolean): IAction<boolean> {
    return { type: EActions.FETCHING_DATAS, payload };
}

export { setEmployeeFocus, setEmployees, employeeRemove, setFetchingData, EActions };