import { Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { DeriveMasterKey, DeriveAuthKey } from "../../utils/crypto";
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

function LoginPage(props) {
    const history = useHistory();
    const location = useLocation();

    async function LoginHandler(values) {
        let formData = new URLSearchParams();
        formData.append("username", values.username);
        const preLogin = await axios.post("/api/pre-login", formData);
        const account_salt = preLogin.data["account_salt"];
        const masterKey = await DeriveMasterKey(
            values.password,
            account_salt,
            512
        );
        const authKey = await DeriveAuthKey(masterKey, 256);
        formData.append("password", authKey);
        try {
            await axios.post("/api/login", formData);
            let { from } = location.state || { from: { pathname: "/" } };
            history.replace(from);
        } catch (error) {
            message.error(error.response.data.message);
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
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default LoginPage;
