import { Menu, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import axios from "axios";

// The menu item for uploading files
function UploadFile(props) {
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
        await props.callback();
    };
    return (
        <Menu.Item
            key="uploadfile"
            icon={<UploadOutlined />}
            onClick={() => upload.current.click()}
            className={props.classname}
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
    );
}

export default UploadFile;
