import { Layout, Tabs } from "antd";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";

import "./Login.scss"


const { TabPane } = Tabs;

function Login(props) {
    return (
        <Layout id="loginRoot">
            <div id="loginContainer">
                <div id="loginLogoContainer">
                    <img src="/loginLogo.png" alt="logo" id="loginLogo" />
                    <span id="loginLogoText">Home Cloud System</span>
                </div>
                <div id="loginTabContainer">
                    <Tabs defaultActiveKey="0" id="loginTabs" centered>
                        <TabPane tab="Login" key="0">
                            <LoginPage />
                        </TabPane>
                        <TabPane tab="Sign Up" key="1">
                            <SignUp />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    )

}
export default Login;