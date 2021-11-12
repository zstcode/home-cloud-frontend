import { Layout, PageHeader, Avatar } from "antd";
import React, { useRef } from "react";
import { Form, Input, Select, Button } from "antd";
import avatarUploadHandler from "./utils/avatarUpload";
import "./Profile.scss";

const { Option } = Select;
const { TextArea } = Input;

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
            span: 2,
            offset: 0,
        },
        sm: {
            span: 17,
            offset: 4,
        },
    },
};

const avatartSize = {
    xs: 64,
    sm: 64,
    md: 64,
    lg: 80,
    xl: 80,
    xxl: 100,
};

// Component for user profile settings
function Profile(props) {
    const [form] = Form.useForm();
    const avatartUploader = useRef();

    const handleAvatarUpload = async (event) => {
        event.preventDefault();
        await avatarUploadHandler(avatartUploader.current.files[0], props.setReload);
        avatartUploader.current.value = "";
    }

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };

    return (
        <Layout id="profileLayout">
            <PageHeader className="profilePageHeader" title="Profile" />
            <div id="profileContent">
                <div id="avatarContainer">
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        ref={avatartUploader}
                        onChange={handleAvatarUpload}
                        style={{ display: "none" }}
                    />
                    {props.user.avatar ?
                        <Avatar
                            id="profileAvatar"
                            size={avatartSize}
                            src={props.user.avatar}
                            onClick={() => avatartUploader.current.click()}
                        /> :
                        <Avatar id="profileAvatar"
                            style={{
                                backgroundColor:
                                    "#00a2ae",
                                fontSize: "25pt",
                            }}
                            size={avatartSize}
                            onClick={() => avatartUploader.current.click()}
                        >
                            {props.user.username.slice(0, 2)}
                        </Avatar>
                    }
                </div>
                <div id="profileFormContainer">
                    <Form
                        form={form}
                        name="profile"
                        onFinish={onFinish}
                        scrollToFirstError
                        {...formItemLayout}
                        id="profileForm"
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your username",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                },
                                {
                                    required: true,
                                    message: "Please input your E-mail!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="nickname"
                            label="Nickname"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your nickname!",
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select gender!",
                                },
                            ]}
                        >
                            <Select placeholder="select your gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="Bio" label="Bio">
                            <TextArea />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <div id="Profiletail">
                                <Button
                                    onClick={() => form.resetFields()}
                                    id="ProfiletailResetButton"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    id="ProfiletailSubmitButton"
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
