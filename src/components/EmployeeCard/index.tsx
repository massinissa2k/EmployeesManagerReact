import "./style.scss";
import React from "react";
import { IEmployee } from "../../redux/type";
import { Card, Typography, CardContent, CardActionArea, CardHeader, IconButton, Menu, MenuItem } from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RestApiExampleWebService from "../../classes/RestApiExampleWebService";

interface IProps {
    employee: IEmployee;
    history: any;
    type: "create_employee"|"common";
}

type IState = {
    anchorEl: HTMLElement | null;
};

class EmployeeCard extends React.Component<IProps, IState> {

    private static readonly options = [
        'Voir',
        'Editer',
        'Supprimer',
    ];

    constructor(public props: IProps) {
        super(props);

        this.state = {
            anchorEl: null,
        };

        this.onClickCard = this.onClickCard.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onClickNavigateTo = this.onClickNavigateTo.bind(this);
    }

    public render(): JSX.Element {
        return <Card className="employee-card" title={this.props.employee.employee_name}>
            <CardHeader action={
                <IconButton aria-label="settings" onClick={this.onClickCard}>
                    <MoreVertIcon />
                </IconButton>
            }
                subheader={this.props.employee.employee_name}
            />
            <CardActionArea onClick={() => this.onClickNavigateTo("Voir")}>
                <PersonIcon className="employee_box-card-image"></PersonIcon>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" >Age: {this.props.employee.employee_age}</Typography>
                    <Typography variant="body2" color="textSecondary" component="p" >Salary: {this.props.employee.employee_salary}</Typography>
                </CardContent>
            </CardActionArea>
            <Menu
                id="long-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
            >
                {EmployeeCard.options.map(option => (
                    <MenuItem key={option} onClick={() => this.onClickNavigateTo(option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Card>;
    }

    private onClickCard(e: React.MouseEvent<HTMLElement>): void {
        this.setState({
            anchorEl: e.currentTarget
        });
    }

    protected async onClickNavigateTo(option: string): Promise<void> {
        if (option === "Voir") {
            this.props.history.push("/employee/" + this.props.employee.id);
        }

        if (option === "Editer") {
            this.props.history.push("/employee/".concat(this.props.employee.id ,"/edit"));
        }

        if (option === "Supprimer") {
            await RestApiExampleWebService.getInstance().employeeRemoveStore(this.props.employee.id);
            this.setState({
                anchorEl: null
            }, () => {
                this.props.history.push("/employees");
            });
            return;
        }

        this.setState({
            anchorEl: null
        });
    }

    private handleClose(e: React.MouseEvent): void {
        this.setState({
            anchorEl: null
        });
    }
}

export default EmployeeCard;