import { Modal, Form, Input, message } from "antd";
import axios from "axios";
import { useRef } from "react";

// handleSubmit: Handler for creating a new folder in current folder
const handleSubmit = async (values, path, setVisible, syncFolder) => {
    let formData = new URLSearchParams();
    formData.append("dir", path);
    formData.append("name", values.name);
    formData.append("type", "folder");
    try {
        let res = await axios.post("/api/file/new", formData);
        if (res.status !== 200) {
            message.error(
                `Create folder ${values.name} at ${path} error: ${res.data.message}! `
            );
        } else {
            message.info(`Create folder ${values.name} success! `);
        }
    } catch (error) {
        message.error(
            `Create folder ${values.name} at ${path} error: ${error.response.data.message}! `
        );
    }
    setVisible(false);
    await syncFolder();
};

// The dialog for creating folder
function NewFolderDialog(props) {
    const form = useRef();

    return (
        <Modal
            title="New Folder Dialog"
            destroyOnClose
            visible={props.visible}
            onOk={() => form.current.submit()}
            onCancel={() => {
                props.setVisible(false);
            }}
        >
            <Form
                preserve={false}
                ref={form}
                onFinish={(values) =>
                    handleSubmit(
                        values,
                        props.path,
                        props.setVisible,
                        props.syncFolder
                    )
                }
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item
                    label="Folder Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input new folder name! ",
                        },
                        {
                            pattern: /^((?!\/|\?|\*|\||<|>|:|\\).)*$/,
                            message:
                                "Please do not contain special characters like *?<>|/\\",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default NewFolderDialog;
