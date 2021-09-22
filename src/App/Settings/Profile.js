
import { Layout, PageHeader, Avatar, Upload, message } from "antd";
import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Radio,
} from 'antd';
import "./Profile.scss";


const { Option } = Select;
const { TextArea } = Input;

const uploadProps = {
    name: 'file',
    action: 'http://127.0.0.1:3000/qfqwjbhnqkwdhju',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};


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


function Profile(props) {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Layout id="profileLayout">
            <PageHeader className="profilePageHeader" title="Profile" />
            <div id="profileContent">
                <div id="avatarContainer">
                    <Upload {...uploadProps}>
                        <Avatar id="avatar"
                            size={{ xs: 64, sm: 64, md: 64, lg: 80, xl: 80, xxl: 100 }}
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </Upload>
                </div>
                <div id="profileFormContainer">
                    <Form form={form} name="profile" onFinish={onFinish} scrollToFirstError
                        {...formItemLayout} id="profileForm">
                        <Form.Item name="username" label="username"
                            rules={[{ required: true, message: 'Please input your username', },]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="E-mail"
                            rules={[{ type: 'email', message: 'The input is not valid E-mail!', },
                            { required: true, message: 'Please input your E-mail!', },]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="nickname" label="Nickname" rules={[{
                            required: true, message: 'Please input your nickname!', whitespace: true
                        }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="gender" label="Gender"
                            rules={[{ required: true, message: 'Please select gender!' }]}>
                            <Select placeholder="select your gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="Bio" label="Bio" >
                            <TextArea />
                        </Form.Item>

                        <Form.Item name="Privacy" label="Account Privacy" initialValue={0}>
                            <Radio.Group>
                                <Radio value={0}>Private</Radio>
                                <Radio value={1}>Public</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout} >
                            <div id="Profiletail">
                                <Button onClick={() => form.resetFields()}
                                    id="ProfiletailResetButton">Reset</Button>
                                <Button type="primary" htmlType="submit"
                                    id="ProfiletailSubmitButton">Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Layout>
    )
}

export default Profile;