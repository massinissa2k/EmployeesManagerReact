import { setEmployeeFocus, setEmployees, setFetchingData } from "../redux/actions";
import store from "../redux/store";

import fakeEmployees from "../fakeDatas/employes.json";
import { IEmployee } from "../redux/type";

class RestApiExampleWebService {

    static instance: RestApiExampleWebService;

    private urlPrefix: string = "http://dummy.restapiexample.com/api/v1/";

    constructor() {
        if (!RestApiExampleWebService.instance) {
            RestApiExampleWebService.instance = this;
        }

        return RestApiExampleWebService.instance;
    }

    public static getInstance(): RestApiExampleWebService {
        return RestApiExampleWebService.instance || new RestApiExampleWebService();
    }

    public async employeeCreateStore(employee: IEmployee): Promise<string> {
        const userId = await this.employeeCreate(employee);
        store.dispatch(setEmployees(await this.employeesGet()));
        return userId;
    }

    public async employeeUpdateStore(employee: IEmployee): Promise<void> {
        await this.employeeUpdate(employee);
        store.dispatch(setEmployees(await this.employeesGet()));
    }

    public async employeeRemoveStore(id: string): Promise<void> {
        await this.employeeRemoveById(id);
        store.dispatch(setEmployees(await this.employeesGet()));
    }

    public async employeesSetStore(): Promise<void> {
        store.dispatch(setEmployees(await this.employeesGet()));
    }

    public async employeeSetFocusedStore(id: string): Promise<void> {
        store.dispatch(setEmployeeFocus(await this.employeeGetById(id)));
    }

    private async employeeGetById(id: string): Promise<any> {
        store.dispatch(setFetchingData(true));
        /*const request = new Request(this.urlPrefix.concat("employee/", id));
        const response = await fetch(request);
        const { success, data } = await response.json();
        return data;*/

        //mock
        const data = fakeEmployees.data.find(element => element.id === id);
        setTimeout(() => store.dispatch(setFetchingData(false)), 300);
        return [data];
    }

    private async employeeCreate(employee: IEmployee): Promise<string> {
        store.dispatch(setFetchingData(true));
        const id = employee.id;
        delete employee.id;
        /*const request = new Request(this.urlPrefix.concat("create"), {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8', 
            },
            body: JSON.stringify({
                name: employee.employee_name,
                salary: employee.employee_salary,
                age: employee.employee_age,
            }),
        });
        const response = await fetch(request);
        const { success, data } = await response.json();
        return data.id;*/

        //mock
        const fakeId = Date.now().toString();
        fakeEmployees.data.push({
            id: fakeId,
            ...employee,
        });
        setTimeout(() => store.dispatch(setFetchingData(false)), 300);
        return fakeId;
    }

    private async employeeUpdate(employee: IEmployee): Promise<void> {
        store.dispatch(setFetchingData(true));
        const id = employee.id;
        delete employee.id;
        /*const request = new Request(this.urlPrefix.concat("update/", id), {
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8', 
            },
            body: JSON.stringify({
                name: employee.employee_name,
                salary: employee.employee_salary,
                age: employee.employee_age,
            }),
        });
        await fetch(request);*/

        //mock
        const employeeOrig = fakeEmployees.data.find(element => element.id === id);
        Object.assign(employeeOrig, employee);
        setTimeout(() => store.dispatch(setFetchingData(false)), 300);
    }

    private async employeeRemoveById(id: string): Promise<void> {
        store.dispatch(setFetchingData(true));
        /*const request = new Request(this.urlPrefix.concat("delete/", id));
        await fetch(request);*/

        //mock
        const elementIndex = fakeEmployees.data.findIndex(element => element.id === id);
        fakeEmployees.data.splice(elementIndex, 1);
        setTimeout(() => store.dispatch(setFetchingData(false)), 300);
    }

    private async employeesGet(): Promise<IEmployee[]> {
        store.dispatch(setFetchingData(true));
        /*const request = new Request(this.urlPrefix.concat("employees"));
        const response = await fetch(request);
        const { success, data } = await response.json();
        return data;*/
        //mock
        //return fakeEmployees.data;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(fakeEmployees.data);
                store.dispatch(setFetchingData(false));
            }, 1000);
        });
    }
}

export default RestApiExampleWebService;