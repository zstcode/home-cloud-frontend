import { Drawer, List } from "antd";
import { formatBytes } from "../utils/utils";

// File details drawer
function DetailDrawser(props) {
    const data = [
        `Name: ${props.file.name}`,
        `Size: ${props.file.size === "NA" ? "NA" : formatBytes(props.file.size)}`,
        `Path: ${props.file.position}`,
        `Create Time: ${props.file.createTime}`,
        `Last Modified Time: ${props.file.updateTime}`,
        `Creator: ${props.file.creator}`,
        `Owner: ${props.file.owner}`,
        `Favorite: ${props.file.favorite ? "Yes" : "No"}`,
    ];
    return (
        <Drawer
            title="Details"
            placement="right"
            destroyOnClose
            visible={props.visible}
            width={window.innerWidth >= 576 ? 500 : "100vw"}
            onClose={() => props.setVisible(false)}
        >
            <List
                size="large"
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </Drawer>
    );
}

export default DetailDrawser;
