import { Menu, message } from "antd";
import { useRef } from "react";

function ClickDownload(props) {
    const form = useRef();
    return (
        <Menu.Item
            key="download"
            className="filedropMenuItem"
            onClick={() => {
                if (props.downloadList.length === 1) {
                    form.current.submit();
                } else if (props.downloadList.length > 1) {
                    message.error("Only one selection for download allowed! ");
                } else {
                    message.error("No selection found! ");
                }
            }}
        >
            <form method="post" action="/api/file/get_file" ref={form}>
                <input
                    name="dir"
                    value={
                        props.downloadList.length === 1
                            ? props.downloadList[0]
                            : ""
                    }
                    hidden
                    readOnly
                />
                Download
            </form>
        </Menu.Item>
    );
}

export default ClickDownload;
