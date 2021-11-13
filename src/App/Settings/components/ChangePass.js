import { Form, Input, Button, message } from "antd";
import { DeriveMasterKey, DeriveAuthKey, GenerateSalt } from "../../../utils/crypto";
import axios from "axios";

const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 4,
            offset: 7,
        },
        sm: {
            span: 16,
            offset: 5,
        },
    },
};


function ChangePass(props) {

    const SecuritySubmitHandler = async (values) => {
        const old_account_salt = props.user.account_salt;
        const old_masterKey = await DeriveMasterKey(
            values.opass,
            old_account_salt,
            512
        );
        const old_authKey = await DeriveAuthKey(old_masterKey, 256);

        const new_account_salt = await GenerateSalt(256);
        const new_masterKey = await DeriveMasterKey(
            values.npass,
            new_account_salt,
            512
        );
        const new_authKey = await DeriveAuthKey(new_masterKey, 256);
        let formData = new URLSearchParams();
        formData.append("old", old_authKey);
        formData.append("new", new_authKey);
        try {
            await axios.put("/api/user/password", formData);
            // If error, will not return 200
            message.info("Change password success");
            props.setReload((p) => p + 1);
        } catch (error) {
            message.error(`Change password error: ${error.response.data.message}`);
        }

    }
    return (
        <Form
            name="security"
            scrollToFirstError
            onFinish={SecuritySubmitHandler}
            {...formItemLayout}
        >
            <Form.Item
                name="opass"
                label="Old Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your old password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="npass"
                label="New Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your new password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['npass']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('npass') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
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

export default ChangePass;