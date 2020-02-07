import "./style.scss";
import React from 'react';
import { Provider } from "react-redux";
import { } from "../../redux/actions";
import store from "../../redux/store";

import { Container, LinearProgress, AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import RestApiExampleWebService from "../../classes/RestApiExampleWebService";
import Employees from "../Employees";
import Employee from "../Employee";
import { Unsubscribe } from 'redux';
import HomeIcon from '@material-ui/icons/Home';

type IProps = {};
type IState = {
    displayProgress: "inherit" | "none";
};

class Main extends React.Component<IProps, IState> {

    private readonly restApiExampleWebService: RestApiExampleWebService = new RestApiExampleWebService();
    private unsubscribe: Unsubscribe;
    private hashRouter: Router | undefined;

    constructor(public props: IProps) {
        super(props);

        this.goBack = this.goBack.bind(this);
        this.subscribe = this.subscribe.bind(this);

        this.state = {
            displayProgress: this.getDisplayProgressStatus()
        };

        this.unsubscribe = store.subscribe(this.subscribe);

    }

    public render(): JSX.Element {
        return <Provider store={store}>
            <AppBar className="appbar appbar-shadow" position="static">
                <Toolbar />
            </AppBar>
            <AppBar className="appbar" position="fixed">
                <Toolbar>
                    <Button color="inherit" onClick={this.goBack} ><HomeIcon /></Button>
                    <Typography variant="h6" >
                        Employee manager application
                    </Typography>
                </Toolbar>
                <LinearProgress className="root-progress" style={{ display: this.state.displayProgress }} />
            </AppBar>
            <Container maxWidth="lg">
                <Router ref={(hashRouter: Router)=> {this.hashRouter = hashRouter;}}>
                    <Switch>
                        <Route path="/employee/:id/:create" component={Employee} ></Route>
                        <Route path="/employee/:id/:edit" component={Employee} ></Route>
                        <Route path="/employee/:id" component={Employee} ></Route>
                        <Route path="" component={Employees} ></Route>
                    </Switch>
                </Router>
            </Container>
        </Provider>;
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }

    private getDisplayProgressStatus(): "inherit" | "none" {
        const fetchingData: boolean = store.getState().fetchingData;
        return fetchingData ? "inherit" : "none";
    }

    private subscribe(): void {
        console.log(this.getDisplayProgressStatus());
        this.setState({ displayProgress: this.getDisplayProgressStatus() }, () => {
            console.log(this.state.displayProgress);
        });
    }

    private goBack(): void {
        if(!this.hashRouter) {return;}
        //@ts-ignore
        this.hashRouter.history.push("/");
    }
}

export default Main;