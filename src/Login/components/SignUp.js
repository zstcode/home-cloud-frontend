import { Form, Input, Checkbox, Button } from "antd";

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

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
        }
    }
};

function SignUp(props) {
    return (
        <Form name="signup" {...formLayout} onFinish={onFinish}
            onFinishFailed={onFinishFailed}>

            <Form.Item label="Username" name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Password" name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item name="confirm" label="Confirm Password" dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="agreement" valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                    },
                ]}
                {...formTailLayout}>
                <Checkbox>
                    I have read the <a href="">agreement</a>
                </Checkbox>
            </Form.Item>

            <Form.Item {...formTailLayout}>
                <div id="buttonContainer">
                    <Button type="primary" htmlType="submit">
                        SignUp
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default SignUp;