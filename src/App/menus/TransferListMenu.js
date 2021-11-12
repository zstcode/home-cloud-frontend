import { Menu, Progress } from "antd";

// transerListMenu: The menu showing the status of uploading or downloading progress
const transerListMenu = (transferList) => {
    return (
        <Menu id="progressMenu">
            {transferList.map((file, index) =>
                <Menu.Item key={index}>
                    <Progress
                        type="circle"
                        width={30}
                        percent={file.progress}
                        status={((status) => {
                            switch (status) {
                                case 1: return "success";
                                case 2: return "exception";
                                default: return "normal";
                            }
                        })(file.status)}
                    />
                    <span className="progressName">{file.name}</span>
                </Menu.Item>
            )}
        </Menu>
    )
}

export default transerListMenu;