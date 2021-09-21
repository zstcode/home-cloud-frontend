import { Modal, Form, Input } from "antd";

function FileDialog(props) {
    return (
        <Modal title="FileDialog" destroyOnClose visible={props.visible} onOk={props.form.submit} onCancel={props.handleCancel}>
            <Form form={props.form} onFinish={props.handleSubmit} preserve={false}>
                <Form.Item label="nfilename" name="nfilename"
                    rules={[{ required: true, message: 'Please input filename!' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default FileDialog;