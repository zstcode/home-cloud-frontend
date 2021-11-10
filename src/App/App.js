import { Layout, Menu, Avatar, Button, Dropdown, message } from "antd";
import {
    ShareAltOutlined,
    UserOutlined,
    StarOutlined,
    DashboardOutlined,
} from "@ant-design/icons";
import {
    FileOutlined,
    TagOutlined,
    ProfileOutlined,
    SecurityScanOutlined,
} from "@ant-design/icons";
import {
    CloudUploadOutlined,
    SettingOutlined,
    SearchOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Switch, Route, Link } from "react-router-dom";
import { Redirect, useHistory, useLocation } from "react-router";
import FileList from "./Files/FileList";
import Profile from "./Settings/Profile";

import { useState, useEffect } from "react";

import "./App.scss";
import axios from "axios";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

// Main component for the app
const App = () => {
    const history = useHistory();
    const location = useLocation();
    const [user, setUser] = useState({ username: "", status: 0 });

    // Intercept all 401 response and rediret to login page
    axios.interceptors.response.use(
        (res) => res,
        (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    history.push("/login", { from: location });
                }
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        // Get current login user info
        const fetchUser = async () => {
            try {
                let res = await axios.get("/api/status/user");
                if (res.data["success"] === 0) {
                    setUser({
                        username: res.data["username"],
                        status: res.data["status"],
                    });
                } else {
                    message.error(res.data["message"]);
                }
            } catch (error) {
                message.error(error.response.data["message"]);
            }
        };
        fetchUser();
    }, []);

    const profileMenu = (
        <Menu id="profileMenu" theme="dark">
            <Menu.Item id="profileUsername" key="username" disabled>
                {user.username}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
                key="profile"
                icon={<ProfileOutlined />}
                className="profileMenuItem"
            >
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item
                key="settings"
                icon={<SettingOutlined />}
                className="profileMenuItem"
            >
                Settings
            </Menu.Item>
            <Menu.Item
                key="Logout"
                icon={<LogoutOutlined />}
                className="profileMenuItem"
                onClick={() => history.push("/logout")}
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout id="rootLayout">
            <Header className="header">
                <div className="logo">
                    <img src="/logo.png" alt="logo" id="logosvg" />
                    <span id="logotext">Home Cloud System</span>
                </div>
                <div className="headerMenuContainer">
                    <div className="headerMenu">
                        <Button
                            ghost
                            size="large"
                            icon={<CloudUploadOutlined />}
                            className="headerMenuButtom"
                        ></Button>
                        <Dropdown
                            overlay={profileMenu}
                            placement="bottomLeft"
                            trigger={["click"]}
                        >
                            <Button
                                ghost
                                size="large"
                                icon={
                                    <Avatar
                                        id="avatar"
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                    />
                                }
                                className="avatarButtom"
                            ></Button>
                        </Dropdown>
                    </div>
                </div>
            </Header>
            <Layout>
                <Sider
                    className="site-layout-background"
                    breakpoint="lg"
                    collapsedWidth={0}
                    width="200px"
                    id="sider"
                >
                    {/* Default to open all submenu and select item based on the path */}
                    <Menu
                        id="sideMenu"
                        mode="inline"
                        defaultSelectedKeys={
                            history.location.pathname.split("/").filter((v) => v.length > 0)[0]
                        }
                        defaultOpenKeys={["filesSub", "accountSub"]}
                    >
                        {/* <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                            Dashboard
                        </Menu.Item> */}
                        <SubMenu
                            key="filesSub"
                            icon={<FileOutlined />}
                            title="Files"
                        >
                            <Menu.Item key="files" icon={<FileOutlined />}>
                                <Link to="/files">My Files</Link>
                            </Menu.Item>
                            <Menu.Item key="search" icon={<SearchOutlined />}>
                                Search
                            </Menu.Item>
                            <Menu.Item key="favorites" icon={<StarOutlined />}>
                                Favorites
                            </Menu.Item>
                            <Menu.Item key="share" icon={<ShareAltOutlined />}>
                                Shared
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="accountSub"
                            icon={<UserOutlined />}
                            title="Account"
                        >
                            <Menu.Item
                                key="profile"
                                icon={<ProfileOutlined />}
                            >
                                <Link to="/profile">Profile</Link>
                            </Menu.Item>
                            <Menu.Item
                                key="security"
                                icon={<SecurityScanOutlined />}
                            >
                                Security
                            </Menu.Item>
                            <Menu.Item
                                key="settings"
                                icon={<SettingOutlined />}
                            >
                                Settings
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>

                <Layout
                    id="contentLayoutArea"
                    className="site-layout-background"
                >
                    <Switch>
                        <Route
                            path="/files/(.*)"
                            render={() => <FileList user={user} />}
                        />
                        {/* Redirect to add the root slash to the path */}
                        <Route
                            exact
                            path="/files"
                            component={() => <Redirect to="/files/" />}
                        />
                        <Route path="/profile" component={Profile} />
                    </Switch>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;
