import "./style.scss";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import store from "../../redux/store";
import RestWebService from "../../classes/RestWebService";
import { IEmployee } from "../../redux/type";
import { Unsubscribe } from "redux";
import { Card, CardHeader, CardActionArea, CardContent, IconButton, Menu, MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import EmployeeObject from '../../classes/EmployeeObject';

type IRoutParams = {
    id: string | undefined;
    edit: string | undefined;
    create: string | undefined;
};
type IProps = RouteComponentProps<IRoutParams>;
interface IState extends IEmployee {
    anchorEl: HTMLElement | null;
};

class Employee extends React.Component<IProps, IState> {

    private static readonly options = [
        'Confirmer la suppression',
    ];

    private unsubscribe: Unsubscribe;
    constructor(public props: IProps) {
        super(props);
        this.subscribe = this.subscribe.bind(this);
        
        this.state = {
            ...(store.getState().employeeFocus || new EmployeeObject()),
            anchorEl: null,
        };

        this.unsubscribe = store.subscribe(this.subscribe);

        this.onClickCardRemove = this.onClickCardRemove.bind(this);
        this.onClickCardEdit = this.onClickCardEdit.bind(this);
        this.onClickCardValidate = this.onClickCardValidate.bind(this);
        this.onClickCardCancel = this.onClickCardCancel.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public render(): JSX.Element {

        if (!this.state.id && !this.props.match.params.create) {
            return <div>Changement...</div>
        }

        return <Card className="employee-card employee-big-card" title={this.state.employee_name}>
            <CardHeader action={this.getHeaderActions()}
                subheader={this.getEmployeeNameField()}
            />
            <CardActionArea onClick={() => this.onClickNavigateTo("Voir")}>
                <PersonIcon className="employee_box-card-image"></PersonIcon>
                <CardContent>
                    <div>{this.getEmployeeAgeField()}</div>
                    <div>{this.getEmployeeSalaryField()}</div>
                </CardContent>
            </CardActionArea>
            <Menu
                id="long-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
            >
                {Employee.options.map(option => (
                    <MenuItem key={option} onClick={() => this.onClickNavigateTo(option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Card>;
    }

    public componentDidMount(): void {
        if (this.props.match.params.id) {
            RestWebService.getInstance().employeeSetFocusedStore(this.props.match.params.id);
        }
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }

    private getEmployeeNameField(): JSX.Element {
        const props: TextFieldProps = {label: "Name", value: this.state.employee_name, InputProps: { readOnly: true } };

        if (this.props.match.params.edit || this.props.match.params.create) {
            props.onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ employee_name: e.currentTarget.value });
            (props.InputProps as any).readOnly = false;
        }

        return <TextField {...props} />;
    }

    private getEmployeeAgeField(): JSX.Element {
        if (this.props.match.params.edit || this.props.match.params.create) {
            return <TextField type="number" label="Age" value={this.state.employee_age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ employee_age: e.currentTarget.value });
            }} />;
        }

        return <TextField type="number" label="Age" value={this.state.employee_age} InputProps={{ readOnly: true }} />;
    }

    private getEmployeeSalaryField(): JSX.Element {
        if (this.props.match.params.edit || this.props.match.params.create) {
            return <TextField type="number" label="Salary" value={this.state.employee_salary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ employee_salary: e.currentTarget.value });
            }} />;
        }

        return <TextField type="number" label="Salary" value={this.state.employee_salary} InputProps={{ readOnly: true }} />;
    }

    private getHeaderActions(): JSX.Element[] {
        const actions: JSX.Element[] = [];

        if (this.props.match.params.edit || this.props.match.params.create) {
            actions.push(
                <IconButton key="done" aria-label="Valider" title="Valider" onClick={this.onClickCardValidate} >
                    <DoneIcon />
                </IconButton>);

            actions.push(
                <IconButton key="cancel" aria-label="Annuler" title="Annuler" onClick={this.onClickCardCancel} >
                    <CancelIcon />
                </IconButton>);
            return actions;
        }

        actions.push(
            <IconButton key="remove" aria-label="Supprimer" title="Supprimer" onClick={this.onClickCardRemove} >
                <DeleteIcon />
            </IconButton>);

        actions.push(
            <IconButton key="edit" aria-label="Editer" title="Editer" onClick={this.onClickCardEdit}>
                <EditIcon />
            </IconButton>);
        return actions;
    }

    private async onClickCardValidate(e: React.MouseEvent<HTMLElement>): Promise<void> {

        let userId = this.state.id;
        if(this.props.match.params.create) {
            userId = await RestWebService.getInstance().employeeCreateStore(new EmployeeObject(this.state));
            RestWebService.getInstance().employeeSetFocusedStore(userId);
        } else {
            await RestWebService.getInstance().employeeUpdateStore(new EmployeeObject(this.state));
        }

        this.props.history.push("/employee/".concat(userId));
    }
    
    private onClickCardCancel(e: React.MouseEvent<HTMLElement>): void {
        if(!this.state.id) {
            this.props.history.push("/");
            return;
        }
        this.props.history.push("/employee/".concat(this.state.id));
    }

    private onClickCardRemove(e: React.MouseEvent<HTMLElement>): void {
        this.setState({
            anchorEl: e.currentTarget,
        });
    }

    private onClickCardEdit(e: React.MouseEvent<HTMLElement>): void {
        this.props.history.push("/employee/".concat(this.state.id, "/edit"));
    }

    private async onClickNavigateTo(option: string): Promise<void> {
        if (option === "Confirmer la suppression") {
            await RestWebService.getInstance().employeeRemoveStore(this.state.id);
            this.setState({
                anchorEl: null
            }, () => {
                this.props.history.push("/employees");
            });
        }
    }

    private handleClose(e: React.MouseEvent): void {
        this.setState({
            anchorEl: null
        });
    }

    private subscribe(): void {
        let employee: IEmployee = { ...(store.getState().employeeFocus || new EmployeeObject()) };
        this.setState({ ...employee });
    }
}

export default Employee;