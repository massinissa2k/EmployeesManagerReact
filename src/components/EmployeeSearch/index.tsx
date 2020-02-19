import style from "./style.module.scss";
import React from 'react';
import store from "../../redux/store";

import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Unsubscribe } from "redux";
import { IEmployee } from "../../redux/type";
import { RouteComponentProps } from "react-router-dom";

type IRoutParams = { };
type IProps = RouteComponentProps<IRoutParams>;
type IState = {
    employeeFocus: IEmployee | null;
    employees: IEmployee[];
};

class EmployeeSearch extends React.Component<IProps, IState> {

    private unsubscribe: Unsubscribe;
    constructor(public props: IProps) {
        super(props);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = store.subscribe(this.subscribe);
        this.autocompleteTextField = this.autocompleteTextField.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            employeeFocus: store.getState().employeeFocus,
            employees: store.getState().employees,
        };
    }

    public render(): JSX.Element {
        return (<div className={style.employeeSearch}>
            <Autocomplete
                onChange={this.onChange}
                options={this.state.employees}
                getOptionLabel={(option: IEmployee) => option.employee_name}
                value={this.state.employeeFocus}
                clearOnEscape renderInput={this.autocompleteTextField} />
        </div>);
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }

    private subscribe(): void {
        const { employeeFocus, employees } = store.getState();
        this.setState({ employeeFocus, employees, }, () => { });
    }

    private autocompleteTextField(params: any) {
        return <TextField {...params} label="Employés" margin="normal" fullWidth />;
    }

    private onChange(e: React.ChangeEvent<{}>, employee: IEmployee | null) {
        if(!employee) {
            this.props.history.push("/");
            return;
        }
        console.log(employee.id);
        this.props.history.push("/employee/".concat(employee.id));
    }
}

export default EmployeeSearch;
