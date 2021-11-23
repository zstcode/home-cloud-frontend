import {
    Layout,
    PageHeader,
    Table,
    Tooltip,
    Space,
    Button,
    message,
    Modal,
    Input,
    Popconfirm,
    Result
} from "antd";
import { useEffect, useState } from "react";
import { formatBytes } from "../Files/utils/utils";
import SetQuotaDialog from "./components/SetQuotaDialog";
import axios from "axios";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from "@ant-design/icons";

import "./User.scss";

const { Content } = Layout;

// syncUserList: Get the list of all users
const syncUserList = async (setUserList) => {
    try {
        const userData = await axios.get("/api/admin/get_users");
        if (userData.data["success"] !== 0) {
            message.error(`Get user list error: ${userData.data["message"]}`);
            return
        }
        const users = userData.data["users"].map((v, idx) => {
            return {
                key: idx,
                name: v.Name,
                quota: v.Quota,
                status: v.Status,
                encryption: v.Encryption,
            };
        });
        setUserList(users);
    } catch (error) {
        if (error.response !== undefined && error.response.data.message !== undefined) {
            message.error(`Get user list error: ${error.response.data.message}`);
        } else {
            message.error(`Get user list error: ${error}`);
        }
    }
}

// resetPassword: reset user password based on its username
const resetPassword = async (user) => {
    if (user.encryption) {
        message.error("The user has enabled encryption, resetting password is not allowed! ");
        return
    }
    try {
        let formData = new URLSearchParams();
        formData.append("reset_user", user.name);
        const resetData = await axios.post("/api/admin/reset_password", formData);
        if (resetData.data.success !== 0) {
            message.error(`Reset password for ${user.name} error: ${resetData.data.message}`);
            return
        }
        const npassword = resetData.data.result;
        Modal.info({
            title: 'Password Reset Completes',
            content: (
                <Space type="small" style={{ marginTop: "15px" }}>
                    <span>New Password: </span>
                    <Input value={npassword} readOnly style={{ width: "150px" }} addonAfter={
                        <CopyToClipboard text={npassword} onCopy={() => message.info("Copy to clipboard! ")}>
                            <Button icon={<CopyOutlined />} style={{ border: "none", }} size="small" />
                        </CopyToClipboard>}
                    />

                </Space>
            ),
        });
    } catch (error) {
        if (error.response !== undefined && error.response.data.message !== undefined) {
            message.error(`Reset password for ${user.name} error: ${error.response.data.message}`);
        } else {
            message.error(`Reset password for ${user.name} error: ${error}`);
        }
    }
}

// deleteUser: delete a user based on its username
const deleteUser = async (deletedUser, syncUserList, setUserList) => {
    try {
        let formData = new URLSearchParams();
        formData.append("delete_user", deletedUser.name);
        const deleteUserData = await axios.post("/api/admin/delete_user", formData);
        if (deleteUserData.data.success !== 0) {
            message.error(`Delete user ${deletedUser.name} error: ${deleteUserData.data.message}`);
            return
        }
        message.info(`Delete user ${deletedUser.name} success! `);
        await syncUserList(setUserList);
    } catch (error) {
        if (error.response !== undefined && error.response.data.message !== undefined) {
            message.error(`Delete user ${deletedUser.name} error: ${error.response.data.message}`);
        } else {
            message.error(`Delete user ${deletedUser.name} error: ${error}`);
        }
    }
}

// toggleAdmin: Set user as admin or normal user
const toggleAdmin = async (toggleUser, syncUserList, setUserList) => {
    try {
        let formData = new URLSearchParams();
        formData.append("toggle_user", toggleUser.name);
        const res = await axios.post("/api/admin/toggle_admin", formData);
        if (res.data.success !== 0) {
            message.error(`Set user ${toggleUser.name} permission error: ${res.data.message}`);
            return
        }
        message.info(`Set user ${toggleUser.name} permission success! `);
        await syncUserList(setUserList);
    } catch (error) {
        if (error.response !== undefined && error.response.data.message !== undefined) {
            message.error(`Set user ${toggleUser.name} permission error: ${error.response.data.message}`);
        } else {
            message.error(`Set user ${toggleUser.name} permission error: ${error}`);
        }
    }
}

function Users(props) {
    const [userList, setUserList] = useState([])
    const [currentUser, setCurrentUser] = useState({
        key: 0,
        name: "",
        // status: 0 for normal user, 1 for admin
        status: 0,
        // quota: storage quota of the user (byte)
        quota: 0,
        // encryption: user have enabled encryption or not
        encryption: false,
    })
    const [quotaVisible, setQuotaVisible] = useState(false);

    useEffect(() => {
        syncUserList(setUserList);
    }, []);

    const columns = [
        {
            title: 'Username',
            key: 'username',
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
            render: (record) => {
                return (
                    <Tooltip placement="topLeft" title={record.name}>
                        <span>{record.name}</span>
                    </Tooltip>
                )
            },
        },
        {
            title: 'Role',
            key: 'role',
            width: "10%",
            ellipsis: {
                showTitle: false,
            },
            render: (record) => (
                <span>{record.status === 1 ? "admin" : "user"}</span>
            ),
        },
        {
            title: 'Quota',
            key: 'quota',
            width: "15%",
            ellipsis: {
                showTitle: false,
            },
            render: (record) => (
                <span>{formatBytes(record.quota)}</span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: "60%",
            ellipsis: {
                showTitle: false,
            },
            render: (record) => (
                <Space size="small">
                    <Button type="primary" onClick={() => {
                        setCurrentUser(record);
                        setQuotaVisible(true);
                    }}>Quota</Button>
                    <Popconfirm
                        title={`Are you sure to reset password for user ${record.name}?`}
                        placement="topRight"
                        onConfirm={() => resetPassword(record)}
                    >
                        <Button type="primary">Reset Password</Button>
                    </Popconfirm>
                    {record.name !== props.user.username ?
                        <Popconfirm
                            title={`Are you sure to delete user ${record.name}?`}
                            placement="topRight"
                            onConfirm={() => {
                                if (record.name === props.user.name) {
                                    message.error("You cannot delete yourself! ");
                                    return
                                } else {
                                    deleteUser(record, syncUserList, setUserList);
                                }
                            }}
                        >
                            <Button type="primary">Delete</Button>
                        </Popconfirm> : <></>
                    }
                    {record.name !== props.user.username ?
                        <Button type="primary"
                            onClick={() => toggleAdmin(record, syncUserList, setUserList)}>
                            {record.status === 0 ? "Set Admin" : "Set Normal"}
                        </Button>
                        : <></>}
                </Space>
            ),
        },
    ];
    return (
        <Layout className="site-layout-background" id="usersLayout">
            {/* Admin pages are not showing in the mobile devices without enough width */}
            <Result
                className="usersPageBlockWarning"
                status="warning"
                title="Not Available"
                subTitle="Admin page is not available in mobile devices! "
            />
            <div id="usersContentContainer">
                <PageHeader
                    title="User Management"
                    className="pageTitle"
                />
                <SetQuotaDialog
                    visible={quotaVisible}
                    user={currentUser}
                    setVisible={setQuotaVisible}
                    syncUserList={syncUserList}
                    setUserList={setUserList}
                />
                <Content>
                    <div id="usersTableContainer">
                        <Table id="favoritesTable" columns={columns} dataSource={userList} />
                    </div>
                </Content>
            </div>
        </Layout>

    )
}

export default Users;
