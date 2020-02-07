import { IEmployee, IAction } from "../type";
import { EActions } from "../actions";

type IDefaultState = {
    employees: IEmployee[];
    employeeFocus: IEmployee | null;
    fetchingData: boolean;
};

const defaultState: IDefaultState = {
    employees: [],
    employeeFocus: null,
    fetchingData: false,
};

function rootReducers(state: IDefaultState = defaultState, action: IAction<IEmployee[] | boolean>) {

    const nState = { ...state };
    if(typeof action.payload !== "boolean") {
        if (action.type === EActions.SET_EMPLOYEES) {
            nState.employees.splice(0);
            nState.employees.push(...action.payload);
            return nState;
        }
    
        if (action.type === EActions.SET_EMPLOYEE_FOCUS) {
            nState.employeeFocus = action.payload[0] || null;
            return nState;
        }
    } else if (action.type === EActions.FETCHING_DATAS) {
        nState.fetchingData = action.payload;
        return nState;
    }

    return state;
}

export default rootReducers;