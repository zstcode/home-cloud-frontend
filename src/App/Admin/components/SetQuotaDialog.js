import { Modal, Form, Input, message, Select } from "antd";
import axios from "axios";
import { useRef } from "react";
import { formatBytes } from "../../Files/utils/utils";

const { Option } = Select;
const { confirm } = Modal;

// handleSubmit: Submit the set quota request for a user
const handleSubmit = async (values, user, setVisible, syncUserList, setUserList) => {
    const newSize = parseInt(values.quota) * Math.pow(1024, parseInt(values.unit));
    const submitQuotaSetting = async () => {
        let formData = new URLSearchParams();
        formData.append("modified_user", user.name);
        formData.append("quota", newSize);
        try {
            let res = await axios.post("/api/admin/set_user_quota", formData);
            if (res.data.success !== 0) {
                message.error(
                    `Set quota for ${user.name} error: ${res.data.message}! `
                );
            } else {
                message.info(`Set quota for ${user.name} success! `);
            }
        } catch (error) {
            if (error.response !== undefined && error.response.data.message !== undefined) {
                message.error(`Set quota for ${user.name} error: ${error.response.data.message}! `);
            } else {
                message.error(`Set quota for ${user.name} error: ${error}`);
            }
        }
        setVisible(false);
        await syncUserList(setUserList);
    }
    if (newSize < user.quota) {
        confirm({
            title: "Alert",
            content: "New quota is less than previous quota. The user may not be able to upload new files! ",
            onOk() { submitQuotaSetting() },
            onCancel() { return }
        })
    } else {
        await submitQuotaSetting();
    }
};

// unitMapping: Map the unit of storage quota to options in the dialog
// Default is GB
const unitMapping = (unit) => {
    switch (unit) {
        case 'Bytes': return "0";
        case "KB": return "1";
        case "MB": return "2";
        case "GB": return "3";
        case "TB": return "4";
        case "PB": return "5";
        case "EB": return "6";
        case "ZB": return "7";
        case "YB": return "8";
        default: return "3";
    }
}

function SetQuotaDialog(props) {
    const form = useRef();
    const formatSize = formatBytes(props.user.quota).split(" ");

    const unitSelector = (
        <Form.Item
            name="unit"
            noStyle
            rules={[
                {
                    required: true,
                    message: "Please select the unit! ",
                }
            ]}
            initialValue={unitMapping(formatSize[1])}
        >
            <Select style={{ width: "75px" }}>
                <Option value="0">Bytes</Option>
                <Option value="1">KB</Option>
                <Option value="2">MB</Option>
                <Option value="3">GB</Option>
            </Select>
        </Form.Item>
    );

    return (
        <Modal
            title="Set Quota Dialog"
            destroyOnClose
            visible={props.visible}
            onOk={() => form.current.submit()}
            onCancel={() => {
                props.setVisible(false);
            }}
        >
            <Form
                preserve={false}
                ref={form}
                onFinish={(values) =>
                    handleSubmit(
                        values,
                        props.user,
                        props.setVisible,
                        props.syncUserList,
                        props.setUserList
                    )
                }
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item
                    label="New Quota"
                    name="quota"
                    initialValue={formatSize[0]}
                    rules={[
                        {
                            required: true,
                            message: "Please input new quota! ",
                        },
                        {
                            // Only allow integers
                            pattern: /^[0-9]*$/,
                            message:
                                "Please input integers! ",
                        },
                    ]}
                >
                    <Input type="number" min="0" addonAfter={unitSelector} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default SetQuotaDialog;
