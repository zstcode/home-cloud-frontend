import { Menu, Dropdown, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";

// The dropdown menu for settings in the control header
function SettingMenu(props) {
    const menu = (
        <Menu className="fileglobaldropMenu">
            <Menu.Item
                key="folderrename"
                className="filedropMenuItem"
                onClick={props.callback.folderRename}
            >
                Folder Rename
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
            <Button
                id="settingButton"
                ghost
                type="primary"
                className="controlHeaderButton"
                icon={<SettingOutlined />}
            ></Button>
        </Dropdown>
    );
}

export default SettingMenu;
