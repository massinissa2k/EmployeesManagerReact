import style from "./style.module.scss";
import React from "react";
import store from "../../redux/store";
import { Unsubscribe } from "redux";

import RestWebService from "../../classes/RestWebService";
import EmployeeCard from "../EmployeeCard";
import EmployeeCardCreate from "../EmployeeCardCreate";
import { IEmployee } from "../../redux/type";
import { Container } from "@material-ui/core";
import { HashRouter as Router, RouteComponentProps } from "react-router-dom";
import EmployeeObject from "../../classes/EmployeeObject";

interface IProps extends RouteComponentProps {
    employeeCards: JSX.Element[];
}

type IState = {
    employeeCards: JSX.Element[];
};

class Employees extends React.Component<IProps, IState> {

    private unsubscribe: Unsubscribe;
    constructor(public props: IProps) {
        super(props);
        this.subscribe = this.subscribe.bind(this);

        this.unsubscribe = store.subscribe(this.subscribe);
        this.state = {
            employeeCards: this.getEmployeesFromObject(store.getState().employees),
        };
    }

    public render(): JSX.Element {
    return <Container className={style.containerEmployees}><Router>{this.state.employeeCards}</Router></Container>;
    }

    public componentDidMount(): void {
        RestWebService.getInstance().employeesSetStore();
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }

    private subscribe(): void {
        this.setState({ employeeCards: this.getEmployeesFromObject(store.getState().employees) });
    }

    private getEmployeesFromObject(employees: IEmployee[]): JSX.Element[] {
        const employeeCards: JSX.Element[] = [];
        if(employees.length) {
            employeeCards.push(<EmployeeCardCreate key={"create"} type="create_employee" employee={new EmployeeObject()} history={this.props.history} />);
        }

        for (let i = 0, len = employees.length; i < len; i++) {
            employeeCards.push(<EmployeeCard type="common" key={employees[i].id} employee={employees[i]} history={this.props.history} />);
        }

        return employeeCards;
    }
}

export default Employees;