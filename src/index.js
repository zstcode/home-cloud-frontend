import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import "./index.css";
import { Result, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import App from "./App/App";
import Login from "./Login/Login";
import Logout from "./Login/Logout";

ReactDOM.render(
    <Router>
        <Switch>
            <Route path={["/login", "/signup"]} component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/404" component={() =>
                <Result
                    className="gloablErr"
                    icon={<SmileOutlined />}
                    title="404"
                    subTitle="Sorry, the page you visited does not exist! "
                    extra={<Button type="primary"><Link to="/" >Back Home</Link></Button>}
                />} />
            <Route path="/403" component={() =>
                <Result
                    className="gloablErr"
                    icon={<SmileOutlined />}
                    title="403"
                    subTitle="Sorry, you have no permission to view this page! "
                    extra={<Button type="primary"><Link to="/" >Back Home</Link></Button>}
                />} />
            {/* Default redirect to the file list page */}
            <Route exact path="/" component={() => <Redirect to="/files" />} />
            {/* Main component for the app */}
            <Route path="/" component={App} />
        </Switch>
    </Router>,
    document.getElementById("root")
);
