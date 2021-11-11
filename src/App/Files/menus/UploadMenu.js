import { Menu, Dropdown, Button } from "antd";
import { FileAddOutlined, FolderAddOutlined, UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { UploadHandler } from "../utils/FileHanlder";

// The dropdown menu for file uploading and creating
function UploadMenu(props) {
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
            <Menu.Item
                key="uploadfile"
                icon={<UploadOutlined />}
                onClick={() => upload.current.click()}
                className="filedropMenuItem"
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
