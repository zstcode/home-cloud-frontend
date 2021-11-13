import { LogoutOutlined, ProfileOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const profileMenu = (username, history) => (
    <Menu id="profileMenu" theme="dark">
        <Menu.Item id="profileUsername" key="username" disabled>
            {username}
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
            <Link to="/setting" >Settings</Link>
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

export default profileMenu;