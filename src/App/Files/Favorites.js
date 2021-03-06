import { Layout, PageHeader, Table, Tooltip, Button, message } from "antd";
import {
    FolderFilled,
    FileOutlined,
    FileTextOutlined,
    FileMarkdownOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileZipOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Favorites.scss";
import axios from "axios";

const { Content } = Layout;

// syncFavoriteList: fetch favorite file list
const syncFavoriteList = async (setFavoriteFileList) => {
    try {
        let res = await axios.get("/api/file/get_favorite");
        if (res.data["success"] === 0) {
            setFavoriteFileList(
                res.data["favorites"].map((v) => {
                    return {
                        name: v.Name,
                        position: v.Position,
                        dir: v.IsDir,
                    }
                })
            );
        } else {
            message.error(`Get favorite list error: ${res.data["message"]}`);
        }
    } catch (error) {
        if (error.response !== undefined && error.response.data["message"] !== undefined) {
            message.error(`Get favorite list error: ${error.response.data["message"]}`);
        } else {
            message.error(`Get favorite list error: ${error}`);
        }
    }
}

// Favorites: component for showing favorite file list
function Favorites(props) {
    const [favoriteFileList, setFavoriteFileList] = useState([]);

    useEffect(() => {
        syncFavoriteList(setFavoriteFileList);
    }, []);

    const columns = [
        {
            title: 'File Name',
            key: 'name',
            width: "30%",
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
                )
            },
        },
        {
            title: 'Position',
            key: 'position',
            width: "70%",
            ellipsis: {
                showTitle: false,
            },
            render: (record) => (
                <Tooltip placement="topLeft" title={record.position}>
                    <span>{record.position}</span>
                </Tooltip>
            ),
        },
    ];
    return (
        <Layout id="favoritesLayout">
            <PageHeader
                title="Favorite Files"
                className="site-layout-background pageTitle"
            />
            <Content id="favoriteTableArea" className="site-layout-background" >
                <div id="favoriteTableContainer">
                    <Table id="favoritesTable" columns={columns} dataSource={favoriteFileList} />
                </div>
            </Content>

        </Layout>
    )
}

export default Favorites;