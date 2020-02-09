import { setEmployeeFocus, setEmployees, setFetchingData } from "../redux/actions";
import store from "../redux/store";

import fakeEmployees from "../fakeDatas/employes.json";
import { IEmployee } from "../redux/type";
import RestWebServiceV1 from "./RestWebServiceV1";

class RestWebServiceV1Mock extends RestWebServiceV1 {

    static instance: RestWebServiceV1Mock;
    private static readonly RequestDelay = 300;
    constructor() {
        super();
        if (!RestWebServiceV1Mock.instance) {
            RestWebServiceV1Mock.instance = this;
        }

        return RestWebServiceV1Mock.instance;
    }

    protected async employeeGetById(id: string): Promise<any> {
        store.dispatch(setFetchingData(true));

        const data = fakeEmployees.data.find((element: IEmployee) => element.id === id);
        setTimeout(() => store.dispatch(setFetchingData(false)), RestWebServiceV1Mock.RequestDelay);
        return [data];
    }

    protected async employeeCreate(employee: IEmployee): Promise<string> {
        store.dispatch(setFetchingData(true));
        const id = employee.id;
        delete employee.id;

        const fakeId = Date.now().toString();
        fakeEmployees.data.push({
            id: fakeId,
            ...employee,
        });
        setTimeout(() => store.dispatch(setFetchingData(false)), RestWebServiceV1Mock.RequestDelay);
        return fakeId;
    }

    protected async employeeUpdate(employee: IEmployee): Promise<void> {
        store.dispatch(setFetchingData(true));
        const id = employee.id;
        delete employee.id;

        const employeeOrig = fakeEmployees.data.find((element: IEmployee) => element.id === id);
        Object.assign(employeeOrig, employee);
        setTimeout(() => store.dispatch(setFetchingData(false)), RestWebServiceV1Mock.RequestDelay);
    }

    protected async employeeRemoveById(id: string): Promise<void> {
        store.dispatch(setFetchingData(true));

        const elementIndex = fakeEmployees.data.findIndex((element: IEmployee) => element.id === id);
        fakeEmployees.data.splice(elementIndex, 1);
        setTimeout(() => store.dispatch(setFetchingData(false)), RestWebServiceV1Mock.RequestDelay);
    }

    protected async employeesGet(): Promise<IEmployee[]> {
        store.dispatch(setFetchingData(true));

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(fakeEmployees.data);
                store.dispatch(setFetchingData(false));
            }, RestWebServiceV1Mock.RequestDelay);
        });
    }
}

export default RestWebServiceV1Mock;