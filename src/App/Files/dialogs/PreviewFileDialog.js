import { Modal } from "antd";
import { useHistory } from "react-router";

function PreviewFileDialog(props) {
    const history = useHistory();
    const handleClose = () => {
        props.setVisible(false);
        history.push(`/files${props.folderPath}`);
    };
    return (
        <Modal
            title={`${props.file.name}`}
            visible={props.visible}
            width="75vw"
            maskClosable={false}
            onOk={handleClose}
            onCancel={handleClose}
            cancelButtonProps={{ style: { display: "none" } }}
        >
            <h1>File Preview is not available now! </h1>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    );
}

export default PreviewFileDialog;
