import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import "./index.css";
import App from "./App/App";
import Login from "./Login/Login";
import Logout from "./Login/Logout";

ReactDOM.render(
    <Router>
        <Switch>
            <Route path={["/login", "/signup"]} component={Login} />
            <Route path="/logout" component={Logout} />
            <Route exact path="/" component={() => <Redirect to="/files" />} />
            <Route path="/" component={App} />
        </Switch>
    </Router>,
    document.getElementById("root")
);
