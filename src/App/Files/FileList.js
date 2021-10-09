import { Layout, Breadcrumb, PageHeader, Tag, Table, Space, Button } from "antd";
import { Menu, Dropdown, Drawer, Modal, Form, message } from "antd";
import { SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { React, useEffect, useState } from "react";
import FileDialog from "./components/FileDialog";
import { filemanageMenuItems, uploadMenuItems, settingsMenuItems } from "./components/FileDropdownMenu";

import "./FileList.scss";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import axios from "axios";

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


function FileList() {

    const [nameDiaglogvisible, setNameDiaglogvisible] = useState(false);
    const [form] = Form.useForm();
    const [refreshSpin, setRefreshSpin] = useState(false);
    const [detailVisable, setDetailVisable] = useState(false);
    const [folder, setFolder] = useState({ name: "", id: "", root: false, path: [] });
    const [fileList, setFileList] = useState([]);
    const history = useHistory();

    const match = useRouteMatch();

    async function fetchFolder() {
        try {
            const path = match.params[0];
            let folderPath = "/";
            if (path.length > 0 && path[path.length - 1] === "/") {
                folderPath += path.slice(0, path.length - 1)
            } else {
                folderPath += path
            }
            let formData = new URLSearchParams();
            formData.append("path", folderPath);
            const folderData = await axios.post("/api/file/get_info_path", formData)
            setFolder({
                name: folderData.data.file.Name,
                id: folderData.data.file.ID,
                root: folderData.data.file.ParentId === "00000000-0000-0000-0000-000000000000",
                path: folderData.data.file.Position.split("/").filter((v) => v.length > 0)
            })
            formData = new URLSearchParams();
            formData.append("dir", folderData.data.file.ID)
            const fileData = await axios.post("/api/file/list_dir", formData)
            const files = fileData.data.children.map((v, idx) => {
                return {
                    key: idx,
                    id: v.ID,
                    name: v.Name,
                    size: v.Size,
                    time: v.UpdatedAt.slice(0, 10) + " " + v.UpdatedAt.slice(11, 19),
                    tag: "Placeholder",
                }
            });
            setFileList(files);
        } catch (error) {
            if (error.response.status === 401) {
                //Temporary fix
                window.location = "/login"
            } else {
                message.error(error.response.data.message)
            }
        }
    }

    // Fetch data when loading
    // useEffect(() => {
    //     fetchFolder();
    // }, [match])

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
                        return (
                            <Tag color='geekblue' key={tag}>
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
            title: 'Tag',
            key: 'tag',
            dataIndex: 'tag',
            width: "7vw",
            responsive: ["sm"],
            render: tag => (
                <Tag color='green' key={tag}>
                    {tag.toUpperCase()}
                </Tag>
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
                    <a onClick={() => setDetailVisable(true)}>Details</a>
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            responsive: ["xs"],
            render: () => (
                <Space size="middle">
                    <a onClick={() => setDetailVisable(true)}>Details</a>
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
            tag: 'nice',
        },
        {
            key: '2',
            name: 'bhjauifhoqihfoqwi.png',
            size: "5.9MB",
            time: '2012-11-12 18:21:05',
            tag: '',
        },
        {
            key: '3',
            name: 'afsnwqrfjbqwofq.mkv',
            size: "2.65GB",
            time: '2018-05-04 11:15:05',
            tag: 'cool',
        },
    ];

    const uploadMenuCallBack = {
        nfile: () => setNameDiaglogvisible(true),
        nfolder: () => setNameDiaglogvisible(true),
    };
    const settingsMenuCallBack = {
        encryption: () => showConfirm(),
    };
    const fileManegeCallback = {
        rename: () => setNameDiaglogvisible(true),
        delete: () => showConfirm(),
        copy: () => setNameDiaglogvisible(true),
        move: () => setNameDiaglogvisible(true),
        download: () => message.success('Download process has started'),
        favorite: () => message.success('Add to favorite success'),
    };

    const uploadMenu = (
        <Menu className="fileglobaldropMenu">
            {uploadMenuItems(false, uploadMenuCallBack)}
        </Menu>
    );

    const globalManageMenu = (
        <Menu className="fileglobaldropMenu">
            {uploadMenuItems(true, uploadMenuCallBack)}
            {filemanageMenuItems(true, fileManegeCallback)}
            {settingsMenuItems(true, settingsMenuCallBack)}
        </Menu>
    );
    const folderSettingMenu = (
        <Menu className="fileglobaldropMenu">
            {settingsMenuItems(false, settingsMenuCallBack)}
        </Menu>
    )
    const manageMenu = (
        <Menu className="filedropMenu">
            {filemanageMenuItems(false, fileManegeCallback)}
        </Menu>
    );
    return (
        <Layout id="contentLayoutArea">
            <Breadcrumb id="navigateBreadcrum">
                {folder.path.length > 0 ? <Breadcrumb.Item>Home</Breadcrumb.Item> : <></>}
                {folder.path.map((v) => <Breadcrumb.Item>v</Breadcrumb.Item>)}
            </Breadcrumb>
            <PageHeader className="site-layout-background pageTitle"
                backIcon={folder.path.length > 0 ? true : false}
                onBack={() => null} title={folder.root ? "Home" : folder.name}
                tags={<Tag color="blue">Placeholder</Tag>} />

            <Drawer title="Details" placement="right" visible={detailVisable}
                onClose={() => setDetailVisable(false)}>
                <div>File name: qfmnikaof.txt</div>
                <div>size: 8.9MB</div>
            </Drawer>

            <FileDialog visible={nameDiaglogvisible} form={form}
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
                    {/* <Table columns={columns} dataSource={fileList} rowSelection={{}} /> */}
                    <Table columns={columns} dataSource={data} rowSelection={{}} />

                </div>
            </Content>
        </Layout>
    )
}

export default FileList;