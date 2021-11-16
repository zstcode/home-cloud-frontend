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
        formData.append("user", user.name);
        const resetData = await axios.post("/api/admin/reset_password", formData);
        if (resetData.data.success !== 0) {
            message.error(`Reset password for ${user.name} error: ${resetData.data.message}`);
            return
        }
        const npassword = resetData.data.npassword;
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
const deleteUser = async (deletedUser, syncUserList) => {
    try {
        let formData = new URLSearchParams();
        formData.append("user", deletedUser.name);
        const deleteUserData = await axios.post("/api/admin/delete_user", formData);
        if (deleteUserData.data.success !== 0) {
            message.error(`Delete user ${deletedUser.name} error: ${deleteUserData.data.message}`);
            return
        }
        await syncUserList();
    } catch (error) {
        if (error.response !== undefined && error.response.data.message !== undefined) {
            message.error(`Delete user ${deletedUser.name} error: ${error.response.data.message}`);
        } else {
            message.error(`Delete user ${deletedUser.name} error: ${error}`);
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
                    <Tooltip placement="topLeft" title={record.username}>
                        <span>{record.name}</span>
                    </Tooltip>
                )
            },
        },
        {
            title: 'Role',
            key: 'role',
            width: "15%",
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
            width: "55%",
            ellipsis: {
                showTitle: false,
            },
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => {
                        setCurrentUser(record);
                        setQuotaVisible(true);
                    }}>Set Quota</Button>
                    <Button type="primary" onClick={() => resetPassword(currentUser)}>Reset Password</Button>
                    <Popconfirm
                        title={`Are you sure to delete user ${record.name}?`}
                        placement="topRight"
                        onConfirm={() => {
                            if (record.name === props.user.name) {
                                message.error("You cannot delete yourself! ");
                                return
                            } else {
                                deleteUser(record, syncUserList);
                            }
                        }}
                    >
                        <Button type="primary">Delete User</Button>
                    </Popconfirm>

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
