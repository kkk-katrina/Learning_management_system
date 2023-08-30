import pic from '../img/unsw.jpeg';
import avatar from '../img/hydra2.png';
import '../styles/DashboardPage.css';
import {
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import {Form, Input, Button, Card, Layout, Menu, Modal, Avatar, message} from 'antd';
import React, {useRef, useState, useEffect} from 'react';
import Draggable from 'react-draggable';
import {Link, useNavigate } from 'react-router-dom';
import ShowCourse from '../components/CourseCard';

const {Content, Footer, Sider} = Layout;



function Dashboard() {
    const uid=localStorage.getItem('uid');
    const role=localStorage.getItem('role');
    const navigate = useNavigate();
    const [defaultAvatar, setDefault] = useState(avatar);
  
    const handleLogout = () => {
        localStorage.clear();
        navigate('/')
    };
    const handleProfile = () => {
        navigate('/profile')
    };
    const handleEditAvatar = () => {
        navigate('/editavatar')
    };
    

    useEffect(() => {
        fetch('http://localhost:8000/downloadavatar/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: localStorage.uid,
            }),
          })
          .then((response) => response.json())
          .then((data) => {
           
            if(data.ava === ''){
              setDefault(avatar);
            }else{
              setDefault(data.ava);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }, []);

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

                    }}
                />
                <Menu theme="dark" mode="inline">
                    <Avatar 
                    style={{
                        size: 40,
                        cursor: 'pointer',
                        marginLeft: '80px',
                    }}
                    src={defaultAvatar} onClick={handleEditAvatar}/>
                    <Menu.Item
                        key="profile"
                        icon={<UserOutlined />}
                        onClick={handleProfile}
                        >
                        Profile
                    </Menu.Item>
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        style={{ position: 'absolute', bottom: 0 }}
                        onClick={handleLogout}
                        >
                        Logout
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: 200,
                }}
            >
                <Content
                    className='content'
                >
                    <div className='topper'><h2>Dashboard</h2></div>
                    <div className='divider'></div>

                    <div style={{position: 'relative'}}>
                        <Button onClick={() => navigate('/dashboard/enrolment')}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '10px',
                                }}>
                            Enrol Courses
                        </Button>
                        <div className='cardBox'>
                            <ShowCourse uid={uid} role={role}/>
                            
                        </div>
                    </div>
                </Content>
                <Footer
                    className='footer'
                >
                    Hydra Learning management system©2023 Created by COMP9900 HYDRA Group
                </Footer>
            </Layout>
        </Layout>


    );
}

export default Dashboard;
