import { Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { DeriveMasterKey, DeriveAuthKey, DeriveEncryptionKey } from "../../utils/crypto";
import { useHistory, useLocation } from "react-router";
import { message } from "antd";

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const formTailLayout = {
    wrapperCol: {
        sm: {
            offset: 8,
            span: 16,
        },
        xs: {
            offset: 0,
            span: 24,
        },
    },
};

// Component for login tab
function LoginPage(props) {
    const history = useHistory();
    const location = useLocation();

    async function LoginHandler(values) {
        let formData = new URLSearchParams();
        formData.append("username", values.username);
        // Use pre-login to fetch the salt of the account
        // If the account not exits, it will get a random result
        try {
            const preLogin = await axios.post("/api/pre-login", formData);
            const account_salt = preLogin.data["account_salt"];
            const masterKey = await DeriveMasterKey(
                values.password,
                account_salt,
                512
            );
            const authKey = await DeriveAuthKey(masterKey, 256);
            formData.append("password", authKey);
            const encryptionKey = await DeriveEncryptionKey(masterKey, 256);

            // The server will return the encryptionKey in the cookies with path parameter
            formData.append("encryptionKey", encryptionKey);
            formData.append("remember", values.remember ? 1 : 0);
            await axios.post("/api/login", formData);
            let { from } = location.state || { from: { pathname: "/" } };
            history.replace(from);
        } catch (error) {
            if (error.response !== undefined && error.response.data.message !== undefined) {
                message.error(`Login error: ${error.response.data.message}`);
            } else {
                message.error(`Login error: ${error}`);
            }
        }
    }
    return (
        <Form
            name="login"
            {...formLayout}
            initialValues={{ remember: true }}
            onFinish={LoginHandler}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    { required: true, message: "Please input your username!" },
                ]}
            >
                <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: "Please input your password!" },
                ]}
            >
                <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
                name="remember"
                valuePropName="checked"
                {...formTailLayout}
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...formTailLayout}>
                <div id="buttonContainer">
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default LoginPage;
