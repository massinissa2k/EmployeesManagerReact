import { IEmployee } from "../redux/type";
import RestWebServiceV1 from "./RestWebServiceV1";
import RestWebServiceV1Mock from "./RestWebServiceV1Mock";

class RestWebService {

    static instance: RestWebService;
    private mockVersion: boolean = true;
    private service: RestWebServiceV1 | RestWebServiceV1Mock;
    constructor() {
        if (!RestWebService.instance) {
            RestWebService.instance = this;
        }

        if(this.mockVersion) {
            this.service = new RestWebServiceV1Mock();
        } else {
            this.service = new RestWebServiceV1();
        }

        return RestWebService.instance;
    }

    public static getInstance(): RestWebService {
        return RestWebService.instance || new RestWebService();
    }

    public async employeeCreateStore(employee: IEmployee): Promise<string> {
        return this.service.employeeCreateStore(employee);
    }

    public async employeeUpdateStore(employee: IEmployee): Promise<void> {
        return this.service.employeeUpdateStore(employee);
    }

    public async employeeRemoveStore(id: string): Promise<void> {
        return this.service.employeeRemoveStore(id);
    }

    public async employeesSetStore(): Promise<void> {
        return this.service.employeesSetStore();
    }

    public async employeeSetFocusedStore(id: string): Promise<void> {
        return this.service.employeeSetFocusedStore(id);
    }

    public async employeeUnSetFocusedStore(): Promise<void> {
        return this.service.employeeUnSetFocusedStore();
    }
}

export default RestWebService;