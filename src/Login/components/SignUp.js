import { Form, Input, Button } from "antd";
import axios from "axios";
import {
    DeriveMasterKey,
    DeriveAuthKey,
    GenerateSalt,
    DeriveEncryptionKey,
} from "../../utils/crypto";
import { useHistory } from "react-router";
import { message } from "antd";
import { useRef } from "react";

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

// Component for sign up tab
function SignUp(props) {
    const history = useHistory();
    const form=useRef();

    async function registerHandler(values) {
        let formData = new URLSearchParams();
        formData.append("username", values.username);
        const account_salt = await GenerateSalt(256);
        const masterKey = await DeriveMasterKey(
            values.password,
            account_salt,
            512
        );
        const authKey = await DeriveAuthKey(masterKey, 256);
        const encryptionKey = await DeriveEncryptionKey(masterKey, 256);

        formData.append("password", authKey);
        formData.append("accountSalt", account_salt);
        formData.append("encryption", encryptionKey);
        try {
            await axios.post("/api/register", formData);
            message.info("Sign up success! ");
            form.current.resetFields();
            history.replace("/login");
        } catch (error) {
            if (error.response !== undefined && error.response.data.message !== undefined) {
                message.error(`Sign up error: ${error.response.data.message}`);
            } else {
                message.error(`Sign up error: ${error}`);
            }
        }
    }
    return (
        <Form name="signup" {...formLayout} onFinish={registerHandler} ref={form}>
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    { required: true, message: "Please input your username!" },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: "Please input your password!" },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error(
                                    "The two passwords that you entered do not match!"
                                )
                            );
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...formTailLayout}>
                <div id="buttonContainer">
                    <Button type="primary" htmlType="submit" block>
                        Sign Up
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default SignUp;
