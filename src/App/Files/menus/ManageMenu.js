import { Menu, Dropdown, Button } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { FolderAddOutlined } from "@ant-design/icons";
import UploadFile from "../components/UploadFile";
import ClickDownload from "../components/ClickDownload";

function ManageMenu(props) {
    const menu = (
        <Menu className="fileglobaldropMenu">
            <Menu.Item
                key="nfile"
                icon={<FileAddOutlined />}
                className="filedropMenuItem showinMobile"
                onClick={props.callback.nfile}
            >
                New File
            </Menu.Item>
            <Menu.Item
                key="nfolder"
                icon={<FolderAddOutlined />}
                className="filedropMenuItem showinMobile"
                onClick={props.callback.nfolder}
            >
                New Folder
            </Menu.Item>
            <UploadFile
                path={props.path}
                classname="filedropMenuItem showinMobile"
                callback={props.callback.upload}
            />
            <Menu.Item
                key="rename"
                className="filedropMenuItem showinMobile"
                onClick={props.callback.rename}
            >
                Rename
            </Menu.Item>
            <Menu.Item
                key="delete"
                className="filedropMenuItem"
                onClick={()=>props.callback.delete(props.paths)}
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
            <ClickDownload downloadList={props.paths} />
            <Menu.Item
                key="favorite"
                className="filedropMenuItem"
                onClick={props.callback.favorite}
            >
                Favorite
            </Menu.Item>
            <Menu.Item
                key="encryption"
                className="filedropMenuItem showinMobile"
                onClick={props.callback.encryption}
            >
                Encryption
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
            <Button
                id="manageButton"
                type="primary"
                className="controlHeaderButton"
            >
                Manage
            </Button>
        </Dropdown>
    );
}

export default ManageMenu;
