import { Layout, PageHeader, Tabs } from "antd";
import React from "react";
import ChangePass from "./components/ChangePass";
import EncryptionSetting from "./components/EncryptionSetting";

import "./Setting.scss";

const { TabPane } = Tabs;

// Component for user settings
function Setting(props) {
    return (
        <Layout id="settingLayout">
            <PageHeader title="Setting" />
            <div id="settingContent">
                <div id="settingContainer">
                    <Tabs>
                        <TabPane tab="Change Password" key="/changepass">
                            <ChangePass user={props.user} />
                        </TabPane>
                        <TabPane tab="Encryption" key="/encryption">
                            <EncryptionSetting />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}

export default Setting;
