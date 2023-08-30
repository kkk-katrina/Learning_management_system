import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import avatar from '../img/hydra2.png';
import { Layout, Menu, theme, Avatar } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  DesktopOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FileOutlined,
  PieChartOutlined,
  LogoutOutlined,
  RollbackOutlined
  } from '@ant-design/icons';
  const { Header, Content, Footer, Sider } = Layout;
  
  const Navibar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleEditAvatar = () => {
      navigate('/editavatar')
    };

    const {
      token: { colorBgContainer },
    } = theme.useToken();
    const logOut = () => {
      localStorage.clear();
      navigate('/');
    }
    if (role === 'lecturer') {
    return (
      <Layout hasSider
      className="site-layout"
      style={{
          minHeight: '100vh'
      }}>
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
          <Avatar 
            style={{
                size: 40,
                cursor: 'pointer',
                marginLeft: '80px',
                marginTop: '20px',
            }}
            src={avatar} onClick={handleEditAvatar}/>

          <Menu theme="dark" mode="inline" items={[
            {
              key: '1',
              icon: <DesktopOutlined />,
              label: 'Announcement',
              onClick: () => {navigate('/coursemainpage/announcementsLecturer')},
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Online Lecture',
              onClick: () => {navigate('/coursemainpage/onlinelecture')},
            },
            {
              key: '3',
              icon: <FileOutlined />,
              label: 'Material',
              onClick: () => {navigate('/coursemainpage/material')},
            },
            {
              key: '4',
              icon: <TeamOutlined />,
              label: 'Forum',
              onClick: () => {navigate('/coursemainpage/forum')},
            },
            {
              key: '5',
              icon: <AppstoreOutlined />,
              label: 'Assignment',
              onClick: () => {navigate('/coursemainpage/assignment')},
            },
            {
              key: '6',
              icon: <BarChartOutlined />,
              label: 'Quiz',
              onClick: () => {navigate('/coursemainpage/quiz')},
            },
            {
              key: '7',
              icon: <LogoutOutlined />,
              label: 'Logout',
              style: { position: 'absolute', bottom: 0 },
              onClick: logOut,
            }
          ]} />
        </Sider>
      </Layout>
    )} else {
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
            <Menu theme="dark" mode="inline" items={[
              {
                key: '1',
                icon: <VideoCameraOutlined />,
                label: 'Online Lecture',
                onClick: () => {navigate('/coursemainpage/onlinelecture')},
              },
              {
                key: '2',
                icon: <FileOutlined />,
                label: 'Material',
                onClick: () => {navigate('/coursemainpage/material')},
              },
              {
                key: '3',
                icon: <TeamOutlined />,
                label: 'Forum',
                onClick: () => {navigate('/coursemainpage/forum')},
              },
              {
                key: '4',
                icon: <AppstoreOutlined />,
                label: 'Assignment',
                onClick: () => {navigate('/coursemainpage/assignment')},
              },
              {
                key: '5',
                icon: <BarChartOutlined />,
                label: 'Quiz',
                onClick: () => {navigate('/coursemainpage/quiz')},
              },
              {
                key: '6',
                icon: <PieChartOutlined />,
                label: 'Grade',
                onClick: () => {navigate('/coursemainpage/grade')},
              },
              {
                key: '7',
                icon: <LogoutOutlined />,
                label: 'Logout',
                style: { position: 'absolute', bottom: 0 },
                onClick: logOut,
              }
            ]} />
          </Sider>
        </Layout>
      )
    }
  };
  export default Navibar;