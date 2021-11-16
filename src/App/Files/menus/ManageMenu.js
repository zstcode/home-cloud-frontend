import { Menu, Dropdown, Button, message } from "antd";
import { FileAddOutlined, FolderAddOutlined, UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { UploadHandler } from "../utils/FileHanlder";

// The dropdown menu for file managing in the control header
function ManageMenu(props) {
    const downloadForm = useRef();
    const upload = useRef();
    const handleUpload = async (event) => {
        event.preventDefault();
        props.setTransferListVisible(true);
        await UploadHandler(
            [...upload.current.files],
            props.path,
            props.callback.upload,
            props.setTransferList
        );
        upload.current.value = "";
    };

    const menu = (
        <Menu className="fileglobaldropMenu">
            {/* showinMobile indicates that the menu item is only avaible in mobile devices */}
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
            <Menu.Item
                key="uploadfile"
                icon={<UploadOutlined />}
                onClick={() => upload.current.click()}
                className="filedropMenuItem showinMobile"
            >
                <input
                    type="file"
                    name="file"
                    onChange={handleUpload}
                    style={{ display: "none" }}
                    ref={upload}
                    multiple
                />
                Upload File
            </Menu.Item>
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
                onClick={() => props.callback.delete(props.paths)}
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
                key="download"
                className="filedropMenuItem"
                onClick={() => {
                    if (props.paths.length === 1) {
                        downloadForm.current.submit();
                    } else if (props.paths.length > 1) {
                        message.error("Only one selection for download allowed! ");
                    } else {
                        message.error("No selection found! ");
                    }
                }}
            >
                <form method="post" action="/api/file/get_file" ref={downloadForm}>
                    <input
                        name="dir"
                        value={
                            props.paths.length === 1
                                ? props.paths[0]
                                : ""
                        }
                        hidden
                        readOnly
                    />
                    Download
                </form>
            </Menu.Item>
            <Menu.Item
                key="favorite"
                className="filedropMenuItem"
                onClick={() => props.callback.favorite(props.paths)}
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
