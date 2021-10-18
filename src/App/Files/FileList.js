import {
    Layout,
    Breadcrumb,
    PageHeader,
    Tag,
    Table,
    Space,
    Button,
} from "antd";
import { Modal, message } from "antd";
import { React, useEffect, useState } from "react";
import {
    StarOutlined,
    StarFilled,
    FolderFilled,
    FileOutlined,
    FileTextOutlined,
    FileMarkdownOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileZipOutlined,
} from "@ant-design/icons";

import NewFileDialog from "./dialogs/NewFileDialog";
import NewFolderDialog from "./dialogs/NewFolderDialog";
import PreviewFileDialog from "./dialogs/PreviewFileDialog";
import RefreshButton from "./components/RefreshButton";

import UploadMenu from "./menus/UploadMenu";
import ManageMenu from "./menus/ManageMenu";
import SettingMenu from "./menus/SettingMenu";
import FileManageMenu from "./menus/FileManageMenu";

import "./FileList.scss";
import { useRouteMatch } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import DetailDrawser from "./components/DetailDrawer";

const { Content } = Layout;
const { confirm } = Modal;

const fetchInfo = async (
    path,
    setFolder,
    setFileList,
    setCurrentFile,
    setPreviewVisable
) => {
    try {
        let folderPath = "/";
        if (path.length > 0 && path[path.length - 1] === "/") {
            folderPath += path.slice(0, path.length - 1);
        } else {
            folderPath += path;
        }
        let formData = new URLSearchParams();
        formData.append("dir", folderPath);
        const pathData = await axios.post("/api/file/get_info", formData);
        if (pathData.data.type === "folder") {
            setFolder({
                name: pathData.data.info.Name,
                root: pathData.data.root,
                path: pathData.data.info.Position,
                encryption: false,
            });
            setPreviewVisable(false);
        } else {
            folderPath = pathData.data.parent_info.Position;
            setFolder({
                name: pathData.data.parent_info.Name,
                root: pathData.data.parent_root,
                path: pathData.data.parent_info.Position,
                encryption: false,
            });
            setCurrentFile({
                name: pathData.data.info.Name,
                position: pathData.data.info.Position,
                size: pathData.data.info.Size,
                type: pathData.data.info.FileType,
                updateTime:
                    pathData.data.info.UpdatedAt.slice(0, 10) +
                    " " +
                    pathData.data.info.UpdatedAt.slice(11, 19),
                createTime:
                    pathData.data.info.CreatedAt.slice(0, 10) +
                    " " +
                    pathData.data.info.CreatedAt.slice(11, 19),
                creator: pathData.data.info.CreatorId,
                owner: pathData.data.info.OwnerId,
                shared: false,
                favorite: false,
            });
            setPreviewVisable(true);
        }
        formData = new URLSearchParams();
        formData.append("dir", folderPath);
        const fileData = await axios.post("/api/file/list_dir", formData);
        const files = fileData.data.children.map((v, idx) => {
            return {
                key: idx,
                dir: v.IsDir,
                name: v.Name,
                size: v.Size,
                type: v.FileType,
                updateTime:
                    v.UpdatedAt.slice(0, 10) + " " + v.UpdatedAt.slice(11, 19),
                createTime:
                    v.CreatedAt.slice(0, 10) + " " + v.CreatedAt.slice(11, 19),
                creator: v.CreatorId,
                owner: v.OwnerId,
                favorite: 0,
                position: v.Position,
            };
        });
        setFileList(files);
    } catch (error) {
        console.log(error);
        message.error(error.response.data.message);
    }
};

const handleDelete = (paths, syncFolder, setSelectedRows) => {
    const title =
        paths.length === 1
            ? `"Do you want to delete ${paths[0]}?"`
            : "Do you want to delete these items?";
    confirm({
        title,
        onOk() {
            const deleteFile = async (paths) => {
                await Promise.all(
                    paths.map(async (v) => {
                        let formData = new URLSearchParams();
                        formData.append("dir", v);
                        try {
                            const res = await axios.post(
                                "/api/file/delete",
                                formData
                            );
                            if (res.data.success === 0) {
                                message.info(`Delete ${v} success! `);
                            } else {
                                message.error(
                                    `Delete ${v} error: ${res.data.message}! `
                                );
                            }
                        } catch (error) {
                            message.error(
                                `Delete ${v} error: ${error.response.data.message}! `
                            );
                        }
                    })
                );
                setSelectedRows([]);
                await syncFolder();
            };
            deleteFile(paths);
        },
        onCancel() {
            return;
        },
    });
};

function FileList(props) {
    const [fileDiaglogvisible, setFileDiaglogvisible] = useState(false);
    const [folderDiaglogvisible, setFolderDiaglogvisible] = useState(false);

    const [detailVisable, setDetailVisable] = useState(false);
    const [previewVisable, setPreviewVisable] = useState(false);

    const [folder, setFolder] = useState({
        name: "",
        root: true,
        path: "",
        encryption: false,
    });
    const [fileList, setFileList] = useState([]);
    const [currentFile, setCurrentFile] = useState({
        name: "",
        position: "",
        size: 0,
        type: "",
        createTime: "",
        updateTime: "",
        creator: "",
        owner: "",
        shared: false,
        favorite: false,
    });
    const [selectedRows, setSelectedRows] = useState([]);

    const match = useRouteMatch();

    const syncFolder = async () =>
        await fetchInfo(
            match.params[0],
            setFolder,
            setFileList,
            setCurrentFile,
            setPreviewVisable
        );

    // Fetch data when loading
    useEffect(() => {
        if (props.user.username !== "") {
            fetchInfo(
                match.params[0],
                setFolder,
                setFileList,
                setCurrentFile,
                setPreviewVisable
            );
        }
    }, [match, props.user]);

    const columns = [
        {
            title: "File Name",
            key: "name",
            render: (record) => {
                let icon;
                if (record.dir === 1) {
                    icon = <FolderFilled />;
                } else {
                    switch (record.type) {
                        case "txt":
                            icon = <FileTextOutlined />;
                            break;
                        case "md":
                            icon = <FileMarkdownOutlined />;
                            break;
                        case "image":
                            icon = <FileImageOutlined />;
                            break;
                        case "pdf":
                            icon = <FilePdfOutlined />;
                            break;
                        case "zip":
                            icon = <FileZipOutlined />;
                            break;
                        default:
                            icon = <FileOutlined />;
                    }
                }
                return (
                    <Link to={"/files" + record.position}>
                        <Button type="link" icon={icon} size="small">
                            {record.name}
                        </Button>
                    </Link>
                );
            },
            sorter: (a, b) => {
                return a.name > b.name;
            },
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
            width: "6vw",
            sorter: (a, b) => {
                return a.size > b.size;
            },
            responsive: ["md"],
        },
        {
            title: "Favorite",
            key: "favorite",
            width: "6vw",
            responsive: ["sm"],
            render: (record) =>
                record.favorite === 0 ? (
                    <StarOutlined />
                ) : (
                    <StarFilled style={{ color: "#f8ca00" }} />
                ),
        },
        {
            title: "Last Modified Time",
            dataIndex: "updateTime",
            key: "time",
            width: "13vw",
            responsive: ["lg"],
            sorter: (a, b) => {
                return a.updateTime > b.updateTime;
            },
        },
        {
            title: "Action",
            key: "action",
            width: "20vw",
            responsive: ["sm"],
            render: (record) => (
                <Space size="middle">
                    <form method="post" action="/api/file/get_file">
                        <input
                            name="dir"
                            value={record.position}
                            hidden
                            readOnly
                        />
                        <Button type="link" size="small" htmlType="submit">
                            Download
                        </Button>
                    </form>
                    <FileManageMenu
                        callback={fileManegeCallback}
                        path={record.position}
                    />
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            setCurrentFile({
                                name: record.name,
                                position: record.position,
                                size: record.size,
                                type: record.type,
                                createTime: record.createTime,
                                updateTime: record.updateTime,
                                creator: record.creator,
                                owner: record.owner,
                                shared: false,
                                favorite: false,
                            });
                            setDetailVisable(true);
                        }}
                    >
                        Details
                    </Button>
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            responsive: ["xs"],
            render: () => (
                <Space size="middle">
                    <Button
                        type="link"
                        size="small"
                        onClick={() => setDetailVisable(true)}
                    >
                        Details
                    </Button>
                </Space>
            ),
        },
    ];

    const uploadMenuCallBack = {
        nfile: () => setFileDiaglogvisible(true),
        nfolder: () => setFolderDiaglogvisible(true),
        upload: syncFolder,
    };
    const settingsMenuCallBack = {
        encryption: () => message.error("Encryption is not supported now! "),
    };
    const fileManegeCallback = {
        rename: () => message.error("Rename is not supported now! "),
        delete: (paths) => handleDelete(paths, syncFolder, setSelectedRows),
        copy: () => message.error("Copy is not supported now! "),
        move: () => message.error("Move is not supported now! "),
        favorite: () => message.error("Favorite is not supported now!"),
    };

    return (
        <div id="fileListArea">
            <Breadcrumb id="navigateBreadcrum">
                {folder.path !== "/" ? (
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                ) : (
                    <></>
                )}
                {folder.path
                    .split("/")
                    .filter((v) => v.length > 0)
                    .map((v) => (
                        <Breadcrumb.Item>{v}</Breadcrumb.Item>
                    ))}
            </Breadcrumb>
            <PageHeader
                className="site-layout-background pageTitle"
                backIcon={folder.path.length > 0 ? true : false}
                onBack={() => null}
                title={folder.root ? "Home" : folder.name}
                tags={
                    folder.encryption ? (
                        <Tag color="blue">Encrypted</Tag>
                    ) : (
                        <></>
                    )
                }
            />

            <NewFileDialog
                visible={fileDiaglogvisible}
                setVisible={setFileDiaglogvisible}
                path={folder.path}
                syncFolder={syncFolder}
            />
            <NewFolderDialog
                visible={folderDiaglogvisible}
                setVisible={setFolderDiaglogvisible}
                path={folder.path}
                syncFolder={syncFolder}
            />
            <PreviewFileDialog
                visible={previewVisable}
                setVisible={setPreviewVisable}
                file={currentFile}
                folderPath={folder.path}
            />

            <DetailDrawser
                visible={detailVisable}
                setVisible={setDetailVisable}
                file={currentFile}
            />
            <Content className="site-layout-background contentArea">
                <div id="fileHeader">
                    <div id="fileListType">Files</div>
                    <div id="controlHeader">
                        <UploadMenu
                            path={folder.path}
                            callback={uploadMenuCallBack}
                        />
                        <ManageMenu
                            callback={{
                                ...uploadMenuCallBack,
                                ...fileManegeCallback,
                                ...settingsMenuCallBack,
                            }}
                            paths={selectedRows.map(
                                (v) => fileList[v].position
                            )}
                        />
                        <RefreshButton syncFolder={syncFolder} />
                        <SettingMenu callback={settingsMenuCallBack} />
                    </div>
                </div>
                <div id="fileTable">
                    <Table
                        columns={columns}
                        dataSource={fileList}
                        rowSelection={{
                            selectedRowKeys: selectedRows,
                            onChange: (selectedRowKeys, _) =>
                                setSelectedRows(selectedRowKeys),
                        }}
                    />
                </div>
            </Content>
        </div>
    );
}

export default FileList;
