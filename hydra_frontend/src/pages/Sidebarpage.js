import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
const { Header, Content, Footer, Sider } = Layout;


const Sidebarpage = (props) => {
    // These are the bottons on the sidebar
    const items = props.role === 'lecturer' ? [
        UserOutlined,
        VideoCameraOutlined,
        UploadOutlined,
        BarChartOutlined,
        CloudOutlined,
        AppstoreOutlined,
        TeamOutlined,
        ShopOutlined,
    ].map((icon, index) => ({
        key: String(index + 1),
        icon: React.createElement(icon),
        label: `nav ${index + 1}`,
    })) : [
        UserOutlined,
        VideoCameraOutlined,
        UploadOutlined,
        ShopOutlined,
    ].map((icon, index) => ({
        key: String(index + 1),
        icon: React.createElement(icon),
        label: `nav ${index + 1}`,
    }));

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout hasSider>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
                <Menu theme="dark" mode="inline" items={items} />
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    minHeight: '100vh',
                    marginLeft: 200,
                }}
            >
                {/* <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          /> */}
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    {props.children}
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Hydra Learning management system©2023 Created by COMP9900 HYDRA Group
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Sidebarpage;