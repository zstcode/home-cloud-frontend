import { Layout, Menu, Breadcrumb } from 'antd';
import { ShareAltOutlined, UserOutlined, StarOutlined, DashboardOutlined } from '@ant-design/icons';
import { FileOutlined, TagOutlined, SendOutlined, ProfileOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { NotificationOutlined, SettingOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';

import './App.scss';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const App = () => (
  <Layout id="rootLayout">
    <Header className="header">
      <div className="logo">
        <img src="/logo.png" alt="logo" id="logosvg" />
        <span id="logotext">Home Cloud System</span>
      </div>
      <div className="headerMenuContainer">
        <Menu theme="dark" mode="horizontal" className="headerMenu">
          <Menu.Item key="search" icon={<SearchOutlined />}></Menu.Item>
          <Menu.Item key="notification" icon={<NotificationOutlined />}></Menu.Item>
          <SubMenu key="avatar" title="Username">
            <Menu.Item key="profile" icon={<ProfileOutlined />}>Profile</Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>Settings</Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['dashboard']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <SubMenu key="files" icon={<FileOutlined />} title="Files">
            <Menu.Item key="1" icon={<FileOutlined />}>My Files</Menu.Item>
            <Menu.Item key="2" icon={<SendOutlined />}>Shared with you</Menu.Item>
            <Menu.Item key="3" icon={<ShareAltOutlined />}>Shared by you</Menu.Item>
          </SubMenu>
          <SubMenu key="account" icon={<UserOutlined />} title="Account">
            <Menu.Item key="4" icon={<ProfileOutlined />}>Profile</Menu.Item>
            <Menu.Item key="5" icon={<SecurityScanOutlined />}>Security</Menu.Item>
            <Menu.Item key="6" icon={<NotificationOutlined />}>Notifications</Menu.Item>
            <Menu.Item key="7" icon={<SettingOutlined />}>Settings</Menu.Item>
          </SubMenu>
          <Menu.Item key="favorites" icon={<StarOutlined />}>Favorites</Menu.Item>
          <SubMenu key="tags" icon={<TagOutlined />} title="Tags">
            <Menu.Item key="9">guides</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  </Layout >
);

export default App;