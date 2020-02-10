import { setEmployeeFocus, setEmployees, setFetchingData } from "../redux/actions";
import store from "../redux/store";

import { IEmployee } from "../redux/type";

class RestWebServiceV1 {

    static instance: RestWebServiceV1;

    private urlPrefix: string = "http://dummy.restapiexample.com/api/v1/";

    constructor() {
        if (!RestWebServiceV1.instance) {
            RestWebServiceV1.instance = this;
        }

        return RestWebServiceV1.instance;
    }

    public static getInstance(): RestWebServiceV1 {
        return RestWebServiceV1.instance || new RestWebServiceV1();
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

    protected async employeeGetById(id: string): Promise<any> {
        store.dispatch(setFetchingData(true));
        const request = new Request(this.urlPrefix.concat("employee/", id));
        const response = await fetch(request);
        const { data } = await response.json();
        store.dispatch(setFetchingData(false));
        return data;
    }

    protected async employeeCreate(employee: IEmployee): Promise<string> {
        store.dispatch(setFetchingData(true));
        delete employee.id;
        
        const request = new Request(this.urlPrefix.concat("create"), {
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
        const { data } = await response.json();
        store.dispatch(setFetchingData(false));
        return data.id;
    }

    protected async employeeUpdate(employee: IEmployee): Promise<void> {
        store.dispatch(setFetchingData(true));
        const id = employee.id;
        delete employee.id;
        
        const request = new Request(this.urlPrefix.concat("update/", id), {
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
        await fetch(request);
        store.dispatch(setFetchingData(false));
    }

    protected async employeeRemoveById(id: string): Promise<void> {
        store.dispatch(setFetchingData(true));
        const request = new Request(this.urlPrefix.concat("delete/", id));
        store.dispatch(setFetchingData(false));
        await fetch(request);
    }

    protected async employeesGet(): Promise<IEmployee[]> {
        store.dispatch(setFetchingData(true));
        const request = new Request(this.urlPrefix.concat("employees"));
        const response = await fetch(request);
        const { data } = await response.json();
        store.dispatch(setFetchingData(false));
        return data;
    }
}

export default RestWebServiceV1;