import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useState } from "react";

function RefreshButton(props) {
    const [refreshSpin, setRefreshSpin] = useState(false);
    return (
        <Button
            id="refreshButton"
            ghost
            type="primary"
            className="controlHeaderButton"
            icon={<SyncOutlined spin={refreshSpin} />}
            onClick={async () => {
                setRefreshSpin(true);
                //spin at least 1s
                await Promise.all([
                    props.syncFolder(),
                    new Promise((resolve, _) => setTimeout(resolve, 1000)),
                ]);
                setRefreshSpin(false);
            }}
        ></Button>
    );
}
export default RefreshButton;
