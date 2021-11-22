import { Layout, Menu, Avatar, Button, Dropdown, message, Spin } from "antd";
import {
    UserOutlined,
    StarOutlined,
    FileOutlined,
    ProfileOutlined,
    CloudUploadOutlined,
    SettingOutlined,
    SearchOutlined,
    DeploymentUnitOutlined,
    TeamOutlined
} from "@ant-design/icons";
import { Switch, Route, Link } from "react-router-dom";
import { Redirect, useHistory, useLocation } from "react-router";
import FileList from "./Files/FileList";
import Profile from "./Settings/Profile";
import profileMenu from "./menus/ProfileMenu";
import transerListMenu from "./menus/TransferListMenu";
import Setting from "./Settings/Setting";
import Favorites from "./Files/Favorites";
import SearchPage from "./Files/Search";
import Users from "./Admin/Users";

import { useState, useEffect } from "react";

import "./App.scss";
import axios from "axios";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

// Main component for the app
const App = () => {
    const history = useHistory();
    const location = useLocation();
    // Current Login user
    const [user, setUser] = useState({
        username: "",
        // status: 0 for normal user and 1 for admin
        status: 0,
        email: "",
        nickname: "",
        gender: 0,
        bio: "",
        account_salt: "",
        encryption: false,
    });
    // transferList: {id,name,status,progress}[]->upload file history 
    const [transferList, setTransferList] = useState([]);
    const [transferListVisible, setTransferListVisible] = useState(false);

    // Use to force reload current component
    const [reload, setReload] = useState(1);

    // Intercept all 401 response and rediret to login page
    // redirect 404 and 403 to custom 404 and 403 page
    axios.interceptors.response.use(
        (res) => res,
        (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    history.push("/login", { from: location });
                } else if (error.response.status === 403) {
                    history.replace("/403");
                } else if (error.response.status === 404) {
                    history.replace("/404");
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
                        email: res.data["email"],
                        nickname: res.data["nickname"],
                        gender: res.data["gender"],
                        bio: res.data["bio"],
                        account_salt: res.data["account_salt"],
                        encryption: res.data["encryption"]
                    });
                } else {
                    message.error(`Fetch user data error: ${res.data["message"]}`);
                }
            } catch (error) {
                // Skip the required login message for the first visit
                if (error.response.status === 401) {
                    return;
                }
                if (error.response !== undefined && error.response.data["message"] !== undefined) {
                    message.error(`Fetch user data error: ${error.response.data["message"]}`);
                } else {
                    message.error(`Fetch user data error: ${error}`);
                }
            }
        };
        fetchUser();
    }, [reload]);

    useEffect(() => {
        // Block the refresh if there are any uploading or downloading progresses
        if (transferList.filter((v) => v.status === 0).length > 0) {
            const preventRefresh = (e) => {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
            window.addEventListener("beforeunload", preventRefresh, false);
            return () => window.removeEventListener("beforeunload", preventRefresh, false);
        }
    }, [transferList])

    //If fetching user is still in progress, display the loading page
    if (!user.username) {
        return (
            <Spin
                id="loading"
                size="large"
                tip="Loading"
            />
        )
    } else {
        return (
            <Layout id="rootLayout">
                <Header className="header">
                    <div className="logo">
                        <img src="/logo.png" alt="logo" id="logosvg" />
                        <span id="logotext">Home Cloud System</span>
                    </div>
                    <div className="headerMenuContainer">
                        <div className="headerMenu">
                            {/* If there is no upload history, hide the button */}
                            {transferList.length > 0 ?
                                <Dropdown
                                    overlay={transerListMenu(transferList)}
                                    placement="bottomRight"
                                    trigger={["click"]}
                                    visible={transferListVisible}
                                    onVisibleChange={(v) => setTransferListVisible(v)}
                                >
                                    <Button
                                        ghost
                                        size="large"
                                        icon={<CloudUploadOutlined />}
                                        className="headerMenuButtom"
                                        style={{ marginRight: "10px", cursor: "pointer" }}
                                    ></Button>
                                </Dropdown>
                                : <></>}
                            {/* The avatar button with dropdown to logout and jump to settings */}
                            <Dropdown
                                overlay={profileMenu(user.username, history)}
                                placement="bottomLeft"
                                trigger={["click"]}
                            >
                                <Button
                                    ghost
                                    size="large"
                                    icon={
                                        <Avatar id="avatar"
                                            style={{ backgroundColor: "#00a2ae" }}
                                        >
                                            {user.username.slice(0, 2)}
                                        </Avatar>
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
                        {/* Select the menu item based on url */}
                        <Menu
                            id="sideMenu"
                            mode="inline"
                            selectedKeys={
                                [history.location.pathname.split("/").filter((v) => v.length > 0)[0]]
                            }
                            defaultOpenKeys={
                                user.status === 1 ?
                                    ["filesSub", "accountSub", "adminSub"] :
                                    ["filesSub", "accountSub"]
                            }
                        >
                            <SubMenu
                                key="filesSub"
                                icon={<FileOutlined />}
                                title="Files"
                            >
                                <Menu.Item key="files" icon={<FileOutlined />}>
                                    <Link to="/files">My Files</Link>
                                </Menu.Item>
                                <Menu.Item key="search" icon={<SearchOutlined />}>
                                    <Link to="/search">Search</Link>
                                </Menu.Item>
                                <Menu.Item key="favorites" icon={<StarOutlined />}>
                                    <Link to="/favorites">Favorites</Link>
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
                                    key="settings"
                                    icon={<SettingOutlined />}
                                >
                                    <Link to="/setting">Settings</Link>
                                </Menu.Item>
                            </SubMenu>
                            {/* Will not render the admin submenu if current user is not admin */}
                            {user.status === 1 ?
                                <SubMenu
                                    key="adminSub"
                                    icon={<DeploymentUnitOutlined />}
                                    title="Admin"
                                >
                                    <Menu.Item key="users" icon={<TeamOutlined />}>
                                        <Link to="/users">
                                            Users
                                        </Link>
                                    </Menu.Item>
                                </SubMenu> :
                                null}
                        </Menu>
                    </Sider>

                    <Layout
                        id="contentLayoutArea"
                        className="site-layout-background"
                    >
                        <Switch>
                            {/* User render insteaf of component to prevent unnecessary destroy  */}
                            <Route
                                path="/files/(.*)"
                                render={() =>
                                    <FileList
                                        user={user}
                                        setTransferList={setTransferList}
                                        setTransferListVisible={setTransferListVisible}
                                    />}
                            />
                            {/* Redirect to add the root slash to the path */}
                            <Route
                                exact
                                path="/files"
                                render={() => <Redirect to="/files/" />}
                            />
                            <Route exact path="/favorites" render={() =>
                                <Favorites />} />
                            <Route exact path="/search" render={() =>
                                <SearchPage />} />
                            <Route exact path="/profile" render={() =>
                                <Profile
                                    user={user}
                                    setReload={setReload} />} />
                            <Route exact path="/setting" render={() =>
                                <Setting user={user} setReload={setReload} />
                            } />
                            <Route exact path="/users" render={() => <Users user={user} />} />
                            <Route path="/" render={() =>
                                <Redirect to="/404" />
                            } />
                        </Switch>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
};

export default App;
