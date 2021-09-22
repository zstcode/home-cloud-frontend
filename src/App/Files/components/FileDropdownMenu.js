import { Menu, Upload, message } from "antd";
import { FileAddOutlined } from '@ant-design/icons';
import { FolderAddOutlined, UploadOutlined } from '@ant-design/icons';

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

function uploadMenuItems(isGlobal, callback) {
    const classname = isGlobal ? "filedropMenuItem showinMobile" : "filedropMenuItem";
    return (
        <>
            <Menu.Item key="nfile" icon={<FileAddOutlined />} className={classname}
                onClick={callback.nfile}>New File</Menu.Item>
            <Menu.Item key="nfolder" icon={<FolderAddOutlined />} className={classname}
                onClick={callback.nfolder}>New Folder</Menu.Item>
            <Menu.Item key="uploadfile" icon={<UploadOutlined />} className={classname}>
                <Upload {...uploadProps}>Upload File</Upload>
            </Menu.Item>
        </>
    )
}

function settingsMenuItems(isGlobal, callback) {
    const classname = isGlobal ? "filedropMenuItem showinMobile" : "filedropMenuItem";
    return (
        <Menu.Item key="encryption" className={classname}
            onClick={callback}>Encryption
        </Menu.Item>
    )

}

function globelFileManage(isGlobal, callback) {
    const classname = isGlobal ? "filedropMenuItem showinMobile" : "filedropMenuItem";
    return (
        <Menu.Item key="rename" className={classname}
            onClick={callback.rename}>Rename</Menu.Item>
    )
}

function filemanageMenuItems(isGlobal, callback) {
    return (
        <>
            {globelFileManage(isGlobal, callback)}
            <Menu.Item key="delete" className="filedropMenuItem"
                onClick={callback.delete}>Delete</Menu.Item>
            <Menu.Item key="copy" className="filedropMenuItem"
                onClick={callback.copy} >Copy</Menu.Item>
            <Menu.Item key="move" className="filedropMenuItem"
                onClick={callback.move}>Move</Menu.Item>
            <Menu.Item key="download" className="filedropMenuItem"
                onClick={callback.download}>Download</Menu.Item>
            <Menu.Item key="favorite" className="filedropMenuItem"
                onClick={callback.favorite}>Favorite</Menu.Item>
        </>
    )

}

export { filemanageMenuItems, uploadMenuItems, settingsMenuItems };
