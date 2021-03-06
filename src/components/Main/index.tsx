import style from "./style.module.scss";
import React from 'react';
import { Provider } from "react-redux";
import { } from "../../redux/actions";
import store from "../../redux/store";

import { Container, LinearProgress, AppBar, Toolbar, Typography, Button, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import RestWebService from "../../classes/RestWebService";
import Employees from "../Employees";
import Employee from "../Employee";
import EmployeeSearch from "../EmployeeSearch";
import { Unsubscribe } from 'redux';
import HomeIcon from '@material-ui/icons/Home';

type IProps = {};
type IState = {
    displayProgress: "inherit" | "none";
};

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class Main extends React.Component<IProps, IState> {

    private readonly RestWebService: RestWebService = new RestWebService();
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
        return <ThemeProvider theme={theme}>
            <Provider store={store}>
            <Router ref={(hashRouter: Router) => { this.hashRouter = hashRouter; }}>
                <AppBar className={style.appbarShadow} position="static">
                    <Toolbar />
                </AppBar>
                <AppBar position="fixed">
                    <Toolbar>
                        <Button color="inherit" onClick={this.goBack} ><HomeIcon /></Button>
                        <Typography variant="h6" style={{flexGrow: 1,}}>
                            <span className="app-title" ></span>
                        </Typography>
                        <Switch>
                            <Route path="" component={EmployeeSearch} ></Route>
                        </Switch>
                    </Toolbar>
                    <LinearProgress className={style.progress} style={{ display: this.state.displayProgress }} />
                </AppBar>
                <Container maxWidth="lg">
                        <Switch>
                            <Route path="/employee/:id/:mode" component={Employee} ></Route>
                            <Route path="/employee/:id" component={Employee} ></Route>
                            <Route path="" component={Employees} ></Route>
                        </Switch>
                </Container>
                </Router>
            </Provider>
        </ThemeProvider>;
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }

    private getDisplayProgressStatus(): "inherit" | "none" {
        const fetchingData: boolean = store.getState().fetchingData;
        return fetchingData ? "inherit" : "none";
    }

    private subscribe(): void {
        this.setState({ displayProgress: this.getDisplayProgressStatus() }, () => { });
    }

    private goBack(): void {
        if (!this.hashRouter) { return; }
        //@ts-ignore
        this.hashRouter.history.push("/");
    }
}

export default Main;
