import { Layout, PageHeader, Tag, Table, Space, Button, Tooltip } from "antd";
import { message } from "antd";
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

import NavigateBreadcrumb from "./components/NavigateBreadcrumb";
import RefreshButton from "./components/RefreshButton";
import DetailDrawser from "./components/DetailDrawer";

import UploadMenu from "./menus/UploadMenu";
import ManageMenu from "./menus/ManageMenu";
import SettingMenu from "./menus/SettingMenu";
import FileManageMenu from "./menus/FileManageMenu";

import { HandleDelete, HandleFavorite, FetchInfo } from "./utils/FileHanlder";
import { formatBytes } from "./utils/utils";

import "./FileList.scss";
import { useHistory, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

const { Content } = Layout;

function FileList(props) {
    const [fileDiaglogvisible, setFileDiaglogvisible] = useState(false);
    const [folderDiaglogvisible, setFolderDiaglogvisible] = useState(false);

    const [detailVisable, setDetailVisable] = useState(false);
    const [previewVisable, setPreviewVisable] = useState(false);
    const history = useHistory();

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
        favorite: 0,
    });
    const [selectedRows, setSelectedRows] = useState([]);

    const match = useRouteMatch();

    const syncFolder = async () =>
        await FetchInfo(
            match.params[0],
            setFolder,
            setFileList,
            setCurrentFile,
            setPreviewVisable
        );

    // Fetch data when loading
    useEffect(() => {
        FetchInfo(
            match.params[0],
            setFolder,
            setFileList,
            setCurrentFile,
            setPreviewVisable
        );
    }, [match]);

    // Columns of the FileList table
    const columns = [
        {
            title: "File Name",
            key: "name",
            ellipsis: {
                showTitle: false,
            },
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
                    <Tooltip placement="topLeft" title={record.name}>
                        <Link to={"/files" + record.position}>
                            <Button type="link" icon={icon} size="small">
                                {record.name}
                            </Button>
                        </Link>
                    </Tooltip>
                );
            },
            sorter: (a, b) => {
                return a.name > b.name;
            },
        },
        {
            title: "Size",
            key: "size",
            width: 120,
            sorter: (a, b) => {
                return a.size > b.size;
            },
            render: (record) => formatBytes(record.size),
            responsive: ["md"],
        },
        {
            title: "",
            key: "favorite",
            width: 50,
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
            width: 160,
            responsive: ["lg"],
            sorter: (a, b) => {
                return a.updateTime > b.updateTime;
            },
        },
        {
            title: "Action",
            key: "action",
            width: 260,
            responsive: ["sm"],
            render: (record) => (
                <Space size="small">
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
                                size: record.dir === 0 ? record.size : "NA",
                                type: record.type,
                                createTime: record.createTime,
                                updateTime: record.updateTime,
                                creator: record.creator,
                                owner: record.owner,
                                shared: false,
                                favorite: record.favorite,
                            });
                            setDetailVisable(true);
                        }}
                    >
                        Details
                    </Button>
                    {record.dir === 0 ?
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
                        : <></>}
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 90,
            responsive: ["xs"],
            render: (record) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        setCurrentFile({
                            name: record.name,
                            position: record.position,
                            size: record.dir === 0 ? record.size : "NA",
                            type: record.type,
                            createTime: record.createTime,
                            updateTime: record.updateTime,
                            creator: record.creator,
                            owner: record.owner,
                            shared: false,
                            favorite: record.favorite,
                        });
                        setDetailVisable(true);
                    }}                >
                    Details
                </Button>
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
        delete: (paths) => HandleDelete(paths, syncFolder, setSelectedRows),
        copy: () => message.error("Copy is not supported now! "),
        move: () => message.error("Move is not supported now! "),
        favorite: (paths) => HandleFavorite(paths, syncFolder, setSelectedRows),
    };

    return (
        <Layout id="fileListArea">
            <NavigateBreadcrumb path={folder.path} />
            <PageHeader
                className="site-layout-background filePageTitle"
                onBack={!folder.root ?
                    () => history.push("/files" + folder.path.split("/").slice(0, -1).join("/")) :
                    null
                }
                title={folder.name}
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
            <Content className="site-layout-background" id="fileListcontentArea">
                <div id="fileHeader">
                    <div id="fileListType">Files</div>
                    <div id="controlHeader">
                        <UploadMenu
                            path={folder.path}
                            callback={uploadMenuCallBack}
                            transferList={props.transferList}
                            setTransferList={props.setTransferList}
                            setTransferListVisible={props.setTransferListVisible}
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
                            path={folder.path}
                            setTransferList={props.setTransferList}
                            setTransferListVisible={props.setTransferListVisible}
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
        </Layout>
    );
}

export default FileList;
