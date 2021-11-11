import { Menu, Dropdown, Button, message } from "antd";
import { FileAddOutlined, FolderAddOutlined, UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import axios from "axios";

// The dropdown menu for file uploading and creating
function UploadMenu(props) {
    const upload = useRef();
    const handleUpload = async (event) => {
        event.preventDefault();
        [...upload.current.files].forEach(async (file) => {
            let formData = new FormData();
            formData.append("dir", props.path);
            formData.append("file", file);
            try {
                let res = await axios.post("/api/file/upload", formData);
                if (res.data.success !== 0) {
                    message.error(res.data.message);
                } else {
                    if (res.data.files[file.name].result) {
                        message.info(`Upload ${file.name} success`);
                    } else {
                        message.error(`Upload ${file.name} error`);
                    }
                }
            } catch (error) {
                message.error(error.response.data.message);
            }
        });
        upload.current.value = "";
        await props.callback.upload();
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
