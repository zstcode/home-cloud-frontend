import { Form, Select, Button, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useHistory } from "react-router";

const { Option } = Select;
const { confirm } = Modal;

const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 6 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 4,
            offset: 7,
        },
        sm: {
            span: 6,
            offset: 5,
        },
    },
};


function EncryptionSetting(props) {
    const history = useHistory();

    const submitEncryptionAlgoHandler = async (values) => {
        confirm({
            title: 'Warning: Do you want to change the encryption algorithm?',
            icon: <ExclamationCircleOutlined />,
            content: 'After changing the encryption algorithm, you will not be able to log in until the migration completes! ',
            async onOk() {
                let formData = new URLSearchParams();
                formData.append("algorithm", values.algorithm);
                try {
                    let res = await axios.post("/api/file/change_algorithm", formData);
                    if (res.data.success === 0) {
                        message.info("Change encryption algorithm success! You will be logged out! ")
                        history.push("/login");
                    } else {
                        message.error(`Change encryption algorithm error: ${res.data.message}`);
                    }
                } catch (error) {
                    message.error(`Change encryption algorithm error: ${error.response.data.message}`);
                }
            },
            onCancel() { },
        });
    }
    return (
        <Form name="encryption-setting" {...formItemLayout} onFinish={submitEncryptionAlgoHandler}>
            <Form.Item name="algorithm" label="Encryption Algorithm" rules={[{ required: true }]}>
                <Select>
                    <Option value="None">None</Option>
                    <Option value="AES-256-GCM">AES-256-GCM</Option>
                    <Option value="ChaCha20-Poly1305">ChaCha20-Poly1305</Option>
                    <Option value="XChaCha20-Poly1305">XChaCha20-Poly1305</Option>
                </Select>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button
                    type="primary"
                    htmlType="submit"
                >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default EncryptionSetting;