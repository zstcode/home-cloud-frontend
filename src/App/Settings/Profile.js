import { Layout, PageHeader, Avatar, message } from "antd";
import React, { useRef } from "react";
import { Form, Input, Select, Button } from "antd";
import avatarUploadHandler from "./utils/avatarUpload";
import axios from "axios";
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

    const submitProfile = async (values) => {
        let formData = new URLSearchParams();
        if (values.username !== props.user.username) {
            formData.append("username", values.username);
        }
        if (values.email) {
            formData.append("email", values.email);
        }
        if (values.nickname) {
            formData.append("nickname", values.nickname);
        }
        if (values.gender) {
            formData.append("gender", values.gender);
        }
        if (values.bio) {
            formData.append("bio", values.bio);
        }
        try {
            let res = await axios.post("/api/user/profile", formData);
            if (res.data.success === 0) {
                message.info("Update profile success! ");
                props.setReload((p) => p + 1);
            } else {
                message.error(`Update profile error: ${res.data.message}`);
            }
        } catch (error) {
            message.error(`Update profile error: ${error.response.data.message}`);
        }
    };

    return (
        <Layout id="profileLayout" className="site-layout-background">
            <PageHeader
                title="Profile"
                className="site-layout-background pageTitle"
            />
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
                        onFinish={submitProfile}
                        scrollToFirstError
                        {...formItemLayout}
                        id="profileForm"
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            initialValue={props.user.username}
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
                            initialValue={props.user.email}
                            rules={[
                                {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="nickname"
                            label="Nickname"
                            initialValue={props.user.nickname}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            initialValue={props.user.gender}
                        >
                            <Select placeholder="select your gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="bio" label="Bio" initialValue={props.user.bio}>
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
