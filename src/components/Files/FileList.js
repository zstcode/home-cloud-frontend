import { Layout, Breadcrumb, PageHeader, Tag, Table, Space } from "antd";
import React from "react";

import "./FileList.scss";

const { Content } = Layout;

function FileList() {

    const columns = [
        {
            title: 'File Name',
            key: 'name',
            responsive: ["xs"],
            render: record => (
                <React.Fragment>
                    <a style={{marginRight:"5px"}}>{record.name}</a>
                    <>
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
                        })}        </>

                </React.Fragment>

            ),
            sorter: (a, b) => { return a.name > b.name },
        },
        {
            title: 'File Name',
            dataIndex: 'name',
            key: 'name',
            responsive: ["md"],
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
            responsive: ["md"],
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
            responsive: ["md"],
            render: () => (
                <Space size="middle">
                    <a>Manage</a>
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
    return (
        <Layout id="contentLayoutArea">
            <Breadcrumb id="navigateBreadcrum">
                <Breadcrumb.Item>Files</Breadcrumb.Item>
                <Breadcrumb.Item>Documents</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader className="site-layout-background pageTitle"
                onBack={() => null} title="Documents" tags={<Tag color="blue">doc</Tag>} />
            <Content className="site-layout-background contentArea">
                <div id="fileTable">
                    <Table columns={columns} dataSource={data} />
                </div>
            </Content>
        </Layout>
    )
}

export default FileList;