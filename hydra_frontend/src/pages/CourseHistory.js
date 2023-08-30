import React, { useState, useEffect } from 'react';
import { Card, Button, Timeline, Avatar, Layout, Menu, Tooltip } from 'antd';
import { UserOutlined, LogoutOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import 'antd/dist/reset.css';
import '../styles/CourseHistory.css';
import avatar from '../img/hydra2.png';

const {Header, Content, Footer, Sider} = Layout;

function CourseHistory() {
    const [reverse, setReverse] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [defaultAvatar, setDefault] = useState();

    const role = localStorage.getItem('role');

    //reverse timeline
    const handleClick = () => {
        setReverse(!reverse);
    };

    const jsonToList = (data2) => {
        const enrollment_list = data2.courses.map((course) => {
          return {
            children: course.coursename
          }
        });
        enrollment_list.sort(function(a, b) {
          return b.children.localeCompare(a.children);
        });
        return enrollment_list;
      }

      useEffect(() => {  
        fetch('http://localhost:8000/enrolledcourses/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: localStorage.uid
          }),
        })
          .then(response => response.json())
          .then(data => {
            setData(jsonToList(data));
          });

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
            console.log(data);
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
            <Header style={{ padding: '2px 10px' }}>
                <Link to='/profile'>
                    <Tooltip title="Back">
                    <Button type='link' shape="circle" icon={<RollbackOutlined />} />
                    </Tooltip>
                </Link>
                {role === "student" ? <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>Enrolment History</h2> : <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>Course History</h2>}
            </Header>
            <Content>
              <div className="EnrolmentHistory">
                <Card
                    id="EnrolmentHistory-Card"
                    bordered={false}
                    style={{
                    width: 780,
                    height: 500,
                    }}
                >
                    {role === "student" ? <div id="EnrolmentHistory-Title"><span>Enrolment History</span></div> : <div id="EnrolmentHistory-Title"><span>Course History</span></div>}
                    <div id="EnrolmentHistory-Content">
                        <Timeline
                            reverse={reverse}
                            items={data}
                        />
                    </div>
                    <div id="EnrolmentHistory-ToggleReverse"><Button type="primary" onClick={handleClick} size="large">Toggle Reverse</Button></div>
                </Card>
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

export default CourseHistory;