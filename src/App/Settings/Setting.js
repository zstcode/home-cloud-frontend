import { Layout, PageHeader, Tabs } from "antd";
import React from "react";
import ChangePass from "./components/ChangePass";
import EncryptionSetting from "./components/EncryptionSetting";

import "./Setting.scss";

const { TabPane } = Tabs;

// Component for user settings
function Setting(props) {
    return (
        <Layout id="settingLayout" className="site-layout-background">
            <PageHeader
                title="Setting"
                className="site-layout-background pageTitle"
            />
            <div id="settingContent">
                <div id="settingContainer">
                    <Tabs>
                        <TabPane tab="Change Password" key="/changepass">
                            <ChangePass user={props.user} setReload={props.setReload} />
                        </TabPane>
                        <TabPane tab="Encryption" key="/encryption">
                            <EncryptionSetting user={props.user} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}

export default Setting;
