import { Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useRef } from "react";

const { Option } = Select;

const handleSubmit = async (values, path, setVisible, syncFolder) => {
    let formData = new URLSearchParams();
    formData.append("dir", path);
    formData.append("name", values.name + values.extension);
    formData.append("type", "file");
    try {
        let res = await axios.post("/api/file/new", formData);
        if (res.status !== 200) {
            message.error(
                `Create file ${
                    values.name + values.extension
                } at ${path} error: ${res.data.message}! `
            );
        } else {
            message.info(
                `Create file ${values.name + values.extension} success! `
            );
        }
    } catch (error) {
        message.error(
            `Create file ${values.name + values.extension} at ${path} error: ${
                error.response.data.message
            }! `
        );
    }
    setVisible(false);
    await syncFolder();
};

function NewFileDialog(props) {
    const form = useRef();
    const onTypeChange = (value) => {
        switch (value) {
            case "txt":
                form.current.setFieldsValue({ extension: ".txt" });
                return;
            case "md":
                form.current.setFieldsValue({ extension: ".md" });
                return;
            case "none":
                form.current.setFieldsValue({ extension: "" });
                return;
            default:
                return;
        }
    };

    const extensionSelector = (
        <Form.Item
            name="extension"
            noStyle
            rules={[
                {
                    pattern: /^$|^\.(.){1,}$/,
                    message: "Please select valid file type! ",
                },
                {
                    pattern: /^((?!\/|\?|\*|\||<|>|:|\\).)*$/,
                    message:
                        "Please do not contain special characters like *?<>|/\\",
                },
            ]}
        >
            <Input
                bordered={false}
                style={{ width: 50, cursor: "default" }}
                disabled
            />
        </Form.Item>
    );
    return (
        <Modal
            title="New File Dialog"
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
                    name="type"
                    label="File Type"
                    rules={[
                        {
                            required: true,
                            message: "Please select the file type! ",
                        },
                    ]}
                >
                    <Select onChange={onTypeChange}>
                        <Option value="txt">Text File (.txt)</Option>
                        <Option value="md">Markdown File (.md)</Option>
                        <Option value="none">
                            None Type File (No extension)
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="File Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input new file name! ",
                        },
                        {
                            pattern: /^((?!\/|\?|\*|\||<|>|:|\\).)*$/,
                            message:
                                "Please do not contain special characters like *?<>|/\\",
                        },
                    ]}
                >
                    <Input addonAfter={extensionSelector} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default NewFileDialog;
