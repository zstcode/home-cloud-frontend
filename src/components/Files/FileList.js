import { Layout, Breadcrumb, PageHeader, Tag, Table, Space, Button } from "antd";
import { Menu, Dropdown, Drawer, Modal, Form, Upload, message } from "antd";
import { SettingOutlined, SyncOutlined, FileAddOutlined } from '@ant-design/icons';
import { FolderAddOutlined, UploadOutlined } from '@ant-design/icons';
import { React, useState } from "react";
import Rename from "./utils/Rename";

import "./FileList.scss";

const { Content } = Layout;
const { confirm } = Modal;

function showConfirm() {
    confirm({
        title: 'Do you Want to delete these items?',
        content: 'Some descriptions',
        onOk() {
            console.log('OK');
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

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

function FileList() {

    const [nameDiaglogvisible, setNameDiaglogvisible] = useState(false);
    const [form] = Form.useForm();
    const [refreshSpin, setRefreshSpin] = useState(false);

    const handleSubmit = (values) => {
        console.log(values);
        form.resetFields();
        setNameDiaglogvisible(false);
    }

    const handleCancel = () => {
        setNameDiaglogvisible(false)
        form.resetFields()
    };

    const columns = [
        {
            title: 'File Name',
            key: 'name',
            responsive: ["xs"],
            render: record => (
                <>
                    <a style={{ marginRight: "5px" }}>{record.name}</a>

                    {record.tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}

                </>

            ),
            sorter: (a, b) => { return a.name > b.name },
        },
        {
            title: 'File Name',
            dataIndex: 'name',
            key: 'name',
            responsive: ["sm"],
            render: text => (<a>{text}</a>),
            sorter: (a, b) => { return a.name > b.name },
        },
        {
            title: 'File Size',
            dataIndex: 'size',
            key: 'size',
            width: "8vw",
            sorter: (a, b) => { return a.size > b.size },
            responsive: ["md"],
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: "7vw",
            responsive: ["sm"],
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Last Modified Time',
            dataIndex: 'time',
            key: 'time',
            width: "13vw",
            responsive: ["lg"],
            sorter: (a, b) => { return a.time > b.time },
        },
        {
            title: 'Action',
            key: 'action',
            width: "9vw",
            responsive: ["sm"],
            render: () => (
                <Space size="middle">
                    <Dropdown overlay={manageMenu} placement="bottomCenter" trigger={["click"]}>
                        <a>Manage</a>
                    </Dropdown>
                    <a>Download</a>
                    <a>Details</a>
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            responsive: ["xs"],
            render: () => (
                <Space size="middle">
                    <a>Details</a>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            name: 'a.txt',
            size: "32KB",
            time: '2012-10-12 15:26:21',
            tags: ['nice'],
        },
        {
            key: '2',
            name: 'bhjauifhoqihfoqwi.png',
            size: "5.9MB",
            time: '2012-11-12 18:21:05',
            tags: [],
        },
        {
            key: '3',
            name: 'afsnwqrfjbqwofq.mkv',
            size: "2.65GB",
            time: '2018-05-04 11:15:05',
            tags: ['cool'],
        },
    ];
    const uploadMenu = (
        <Menu className="fileglobaldropMenu">
            <Menu.Item key="nfile" icon={<FileAddOutlined />} className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)}>New File</Menu.Item>
            <Menu.Item key="nfolder" icon={<FolderAddOutlined />} className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)}>New Folder</Menu.Item>
            <Menu.Item key="uploadfile" icon={<UploadOutlined />} className="filedropMenuItem">
                <Upload {...uploadProps}>Upload File</Upload>
            </Menu.Item>
        </Menu>
    );
    const globalManageMenu = (
        <Menu className="fileglobaldropMenu">
            <Menu.Item key="nfile" className="filedropMenuItem showinMobile"
                onClick={() => setNameDiaglogvisible(true)}>New File</Menu.Item>
            <Menu.Item key="nfolder" className="filedropMenuItem showinMobile"
                onClick={() => setNameDiaglogvisible(true)}>New Folder</Menu.Item>
            <Menu.Item key="uploadfile" className="filedropMenuItem showinMobile">
                <Upload {...uploadProps}>Upload File</Upload>
            </Menu.Item>
            <Menu.Item key="encryption" className="filedropMenuItem showinMobile"
                onClick={() => showConfirm}>Encryption</Menu.Item>
            <Menu.Item key="rename" className="filedropMenuItem showinMobile"
                onClick={() => setNameDiaglogvisible(true)}>Rename</Menu.Item>
            <Menu.Item key="delete" className="filedropMenuItem"
                onClick={showConfirm}>Delete</Menu.Item>
            <Menu.Item key="copy" className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)} >Copy</Menu.Item>
            <Menu.Item key="move" className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)}>Move</Menu.Item>
            <Menu.Item key="download" className="filedropMenuItem"
                onClick={() => message.success('Download process has started')}>Download</Menu.Item>
            <Menu.Item key="favorite" className="filedropMenuItem"
                onClick={() => message.success('Add to favorite success')}>Favorite</Menu.Item>
        </Menu>
    );
    const folderSettingMenu = (
        <Menu className="fileglobaldropMenu">
            <Menu.Item key="encryption" className="filedropMenuItem"
                onClick={showConfirm}>Encryption</Menu.Item>
        </Menu>
    )
    const manageMenu = (
        <Menu className="filedropMenu">
            <Menu.Item key="rename" className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)}>Rename</Menu.Item>
            <Menu.Item key="delete" className="filedropMenuItem"
                onClick={showConfirm}>Delete</Menu.Item>
            <Menu.Item key="copy" className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)} >Copy</Menu.Item>
            <Menu.Item key="move" className="filedropMenuItem"
                onClick={() => setNameDiaglogvisible(true)} >Move</Menu.Item>
            <Menu.Item key="download" className="filedropMenuItem"
                onClick={() => message.success('Download process has started')}>Download</Menu.Item>
            <Menu.Item key="favorite" className="filedropMenuItem"
                onClick={() => message.success('Add to favorite success')}>Favorite</Menu.Item>
        </Menu>
    );
    return (
        <Layout id="contentLayoutArea">
            <Breadcrumb id="navigateBreadcrum">
                <Breadcrumb.Item>Files</Breadcrumb.Item>
                <Breadcrumb.Item>Documents</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader className="site-layout-background pageTitle"
                onBack={() => null} title="Documents" tags={<Tag color="blue">doc</Tag>} />

            <Drawer title="Details" placement="right" visible="">
                <div>File name: qfmnikaof.txt</div>
                <div>size: 8.9MB</div>
            </Drawer>

            <Rename visible={nameDiaglogvisible} form={form}
                handleSubmit={handleSubmit} handleCancel={handleCancel} />

            <Content className="site-layout-background contentArea">
                <div id="fileHeader">
                    <div id="fileListType">Files</div>
                    <div id="controlHeader">
                        <Dropdown overlay={uploadMenu} placement="bottomCenter" trigger={["click"]}>
                            <Button id="uploadButton" type="primary"
                                className="controlHeaderButton">+ Add</Button>
                        </Dropdown>
                        <Dropdown overlay={globalManageMenu} placement="bottomLeft" trigger={["click"]}>
                            <Button id="manageButton" type="primary"
                                className="controlHeaderButton">Manage</Button>
                        </Dropdown>
                        <Button id="refreshButton" ghost type="primary" className="controlHeaderButton"
                            icon={<SyncOutlined spin={refreshSpin} />}
                            onClick={() => { setRefreshSpin(true); setTimeout(() => { setRefreshSpin(false); }, 1000) }}
                        ></Button>
                        <Dropdown overlay={folderSettingMenu} placement="bottomLeft" trigger={["click"]}>
                            <Button id="settingButton" ghost type="primary"
                                className="controlHeaderButton" icon={<SettingOutlined />}></Button>
                        </Dropdown>
                    </div>
                </div>
                <div id="fileTable">
                    <Table columns={columns} dataSource={data} rowSelection={{}} />
                </div>
            </Content>
        </Layout>
    )
}

export default FileList;