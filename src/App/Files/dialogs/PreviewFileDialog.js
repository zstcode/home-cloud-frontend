import { Modal, Result } from "antd";
import { useHistory } from "react-router";

// The dialog component for peviewing files
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
            <Result
                status="warning"
                title="File Preview is not available now! "
            />
        </Modal>
    );
}

export default PreviewFileDialog;
