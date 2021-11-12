import { Layout, Tabs } from "antd";
import { useHistory, useLocation } from "react-router";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";

import "./Login.scss";

const { TabPane } = Tabs;

// Component for login and sign up
function Login(props) {
    const location = useLocation();
    const history = useHistory();

    return (
        <Layout id="loginRoot">
            <div id="loginContainer">
                <div id="loginLogoContainer">
                    <img src="/loginLogo.png" alt="logo" id="loginLogo" />
                    <span id="loginLogoText">Home Cloud System</span>
                </div>
                <div id="loginTabContainer">
                    <Tabs
                        activeKey={location.pathname}
                        onChange={(key) => history.replace(key)}
                        id="loginTabs"
                        centered
                    >
                        <TabPane tab="Login" key="/login">
                            <LoginPage />
                        </TabPane>
                        <TabPane tab="Sign Up" key="/signup">
                            <SignUp />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}
export default Login;
