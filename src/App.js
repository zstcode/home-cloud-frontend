import { Layout, Menu, Avatar, Button, Dropdown } from 'antd';
import { ShareAltOutlined, UserOutlined, StarOutlined, DashboardOutlined } from '@ant-design/icons';
import { FileOutlined, TagOutlined, SendOutlined, ProfileOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { NotificationOutlined, SettingOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import FileList from './components/Files/FileList';
import Profile from './components/Settings/Profile';


import './App.scss';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const App = () => {
  const profileMenu = (
    <Menu id="profileMenu" theme="dark">
      <Menu.Item id="profileUsername" key="username" disabled>username</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" icon={<ProfileOutlined />} className="profileMenuItem">Profile</Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} className="profileMenuItem">Settings</Menu.Item>
      <Menu.Item key="Logout" icon={<LogoutOutlined />} className="profileMenuItem">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout id="rootLayout">
      <Header className="header">
        <div className="logo">
          <img src="/logo.png" alt="logo" id="logosvg" />
          <span id="logotext">Home Cloud System</span>
        </div>
        <div className="headerMenuContainer">
          <div className="headerMenu">
            <Button ghost size="large" icon={<SearchOutlined />} className="headerMenuButtom"></Button>
            <Button ghost size="large" icon={<NotificationOutlined />} className="headerMenuButtom"></Button>
            <Dropdown overlay={profileMenu} placement="bottomLeft" trigger={["hover", "click"]}>
              <Button ghost size="large" icon={<Avatar id="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} className="avatarButtom"></Button>
            </Dropdown>

          </div>
        </div>
      </Header>
      <Layout>
        <Sider className="site-layout-background" breakpoint="lg" collapsedWidth={0} width="200px" id="sider">
          <Menu id="sideMenu"
            mode="inline"
            defaultSelectedKeys={['dashboard']}
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
        <Profile />
      </Layout>
    </Layout >);
};

export default App;