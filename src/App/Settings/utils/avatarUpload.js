import axios from "axios";
import { message } from "antd";

const avatarUploadHandler = async (file, setReload) => {
    let formData = new FormData();
    formData.append("avatar", file);
    try {
        let res = await axios.post("/api/user/avatar", formData);
        if (res.data.success === 0) {
            setReload((p => p + 1));
        } else {
            message.error(`Upload avatar error: ${res.data.message}`);
        }
    } catch (error) {
        message.error(`Upload avatar error: ${error.response.data.message}`);
    }
}

export default avatarUploadHandler;