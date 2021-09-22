import { Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
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
        }
    }
};

function LoginPage(props) {
    return (
        <Form name="login" {...formLayout} initialValues={{ remember: true }}
            onFinish={onFinish} onFinishFailed={onFinishFailed}>

            <Form.Item label="Username" name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item label="Password" name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" {...formTailLayout}>
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
    )
}

export default LoginPage;