import { Menu, Dropdown, Button } from "antd";

function FileManageMenu(props) {
    const menu = (
        <Menu className="filedropMenu">
            <Menu.Item
                key="rename"
                className="filedropMenuItem"
                onClick={props.callback.rename}
            >
                Rename
            </Menu.Item>
            <Menu.Item
                key="delete"
                className="filedropMenuItem"
                onClick={() => props.callback.delete([props.path])}
            >
                Delete
            </Menu.Item>
            <Menu.Item
                key="copy"
                className="filedropMenuItem"
                onClick={props.callback.copy}
            >
                Copy
            </Menu.Item>
            <Menu.Item
                key="move"
                className="filedropMenuItem"
                onClick={props.callback.move}
            >
                Move
            </Menu.Item>
            <Menu.Item
                key="favorite"
                className="filedropMenuItem"
                onClick={props.callback.favorite}
            >
                Favorite
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown
            overlay={menu}
            placement="bottomCenter"
            trigger={["click"]}
            destroyPopupOnHide={true}
        >
            <Button type="link" size="small">
                Manage
            </Button>
        </Dropdown>
    );
}

export default FileManageMenu;
