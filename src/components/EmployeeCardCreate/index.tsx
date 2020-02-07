import "./style.scss";
import React from "react";
import EmployeeCard from "../EmployeeCard";
import { Card, CardHeader, CardActionArea, CardContent, Typography, IconButton } from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';

class EmployeeCardCreate extends EmployeeCard {

    public render(): JSX.Element {
        return <Card className="employee-card" title="Create user" onClick={this.onClickNavigateTo} >
            <CardHeader action={
                <IconButton aria-label="settings" style={{visibility: "hidden", pointerEvents: "none"}}>
                    <MoreVertIcon />
                </IconButton>
            }
                subheader="Create user"
            />
            <CardActionArea>
                <AddCircleOutlineIcon className="employee_box-card-image"></AddCircleOutlineIcon>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" >Age</Typography>
                    <Typography variant="body2" color="textSecondary" component="p" >Salary</Typography>
                </CardContent>
            </CardActionArea>
        </Card>;
    }

    protected async onClickNavigateTo(): Promise<void> {
        this.props.history.push("/employee/".concat("x/create"));
    }
}

export default EmployeeCardCreate;