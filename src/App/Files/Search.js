import { Layout, PageHeader, Table, Tooltip, Button, message, Input } from "antd";
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
import { useState } from "react";

import axios from "axios";

import "./Search.scss";

const { Content } = Layout;
const { Search } = Input;

// onSearch: submit the keyword for searching
const onSearch = async (value, setSearchList, setLoading) => {
    setLoading(true);
    try {
        let formData = new URLSearchParams();
        formData.append("keyword", value);
        let res = await axios.post("/api/file/search", formData);
        if (res.data["success"] === 0) {
            setSearchList(
                res.data["result"].map((v) => {
                    return {
                        name: v.Name,
                        position: v.Position,
                        dir: v.IsDir,
                    }
                })
            );
        } else {
            message.error(`Search error: ${res.data["message"]}`);
        }
    } catch (error) {
        if (error.response !== undefined && error.response.data["message"] !== undefined) {
            message.error(`Search error: ${error.response.data["message"]}`);
        } else {
            message.error(`Search error: ${error}`);
        }
    }
    setLoading(false);
}

// SearchPage: Component for searching page
function SearchPage(props) {
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <Layout id="searchLayout">
            <PageHeader
                title="Search"
                className="site-layout-background pageTitle"
            />
            <Content id="searchTableArea" className="site-layout-background" >
                <div id="searchButtonContainer">
                    <div id="searchInput">
                        <Search
                            enterButton="Search"
                            size="large"
                            onSearch={(value) => onSearch(value, setSearchList, setLoading)}
                            loading={loading}
                        />
                    </div>
                </div>
                <div id="searchTableContainer">
                    <Table columns={columns} dataSource={searchList} />
                </div>
            </Content>

        </Layout>
    )
}

export default SearchPage;