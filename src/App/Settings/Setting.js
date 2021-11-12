import { Layout, PageHeader, message } from "antd";
import React from "react";
import { Form, Input, Button } from "antd";
import { DeriveMasterKey, DeriveAuthKey, GenerateSalt } from "../../utils/crypto";
import axios from "axios";

import "./Setting.scss";


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
            span: 15,
            offset: 6,
        },
    },
};

// Component for user settings
function Setting(props) {
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
        <Layout id="settingLayout">
            <PageHeader title="Setting" />
            <div id="settingContent">
                <div id="settingContainer">
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
                </div>
            </div>
        </Layout>
    );
}

export default Setting;
