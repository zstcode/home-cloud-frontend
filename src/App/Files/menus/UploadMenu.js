import { Menu, Dropdown, Button } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { FolderAddOutlined } from "@ant-design/icons";
import UploadFile from "../components/UploadFile";

// The dropdown menu for file uploading and creating
function UploadMenu(props) {
    const menu = (
        <Menu className="fileglobaldropMenu">
            <Menu.Item
                key="nfile"
                icon={<FileAddOutlined />}
                className="filedropMenuItem"
                onClick={props.callback.nfile}
            >
                New File
            </Menu.Item>
            <Menu.Item
                key="nfolder"
                icon={<FolderAddOutlined />}
                className="filedropMenuItem"
                onClick={props.callback.nfolder}
            >
                New Folder
            </Menu.Item>
            <UploadFile
                path={props.path}
                classname="filedropMenuItem"
                callback={props.callback.upload}
            />
        </Menu>
    );
    return (
        <Dropdown overlay={menu} placement="bottomCenter" trigger={["click"]}>
            <Button
                id="uploadButton"
                type="primary"
                className="controlHeaderButton"
            >
                + Add
            </Button>
        </Dropdown>
    );
}

export default UploadMenu;
