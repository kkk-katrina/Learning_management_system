import React, {useState, useEffect} from 'react';
import { UserOutlined, LogoutOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Card, Avatar, Timeline, Layout, Menu, Tooltip} from 'antd';
import {useNavigate, Link} from 'react-router-dom';
import 'antd/dist/reset.css';
import '../styles/Profile.css';
import avatar from '../img/hydra2.png';

const {Header, Content, Footer, Sider} = Layout;

function Profile() {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [defaultAvatar, setDefault] = useState(avatar);
    console.log(data2.courses);

    const role = localStorage.role;

    const jsonToList = (data2) => {
      const enrollment_list = data2.courses.map((course) => {
        return {
          children: course.coursename
        }
      });
      enrollment_list.sort(function(a, b) {
        return b.children.localeCompare(a.children);
      });
      return enrollment_list.slice(0, 3);
    }

    useEffect(() => {
      fetch('http://localhost:8000/showprofile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: localStorage.uid
        }),
      })
        .then((response) => response.json())
        .then((data1) => {
          setData1(data1);
          console.log(data1);
        });

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
        .then(data2 => {
          setData2(jsonToList(data2));
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

    const navigate = useNavigate();
  
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
                <Link to={role === 'lecturer' ? '/dashboardLecturer' : '/dashboard'}>
                    <Tooltip title="Back">
                    <Button type='link' shape="circle" icon={<RollbackOutlined />} />
                    </Tooltip>
                </Link>
                <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>Profile Detail</h2>
            </Header>
            <Content>
                <div id="ProfileDetail-Content">
                  <Card
                    title="Personal Information"
                    bordered={false}
                    style={{
                    width: 360,
                    height: 430,
                    marginRight: 20,
                    fontSize: 15,
                    }}
                  >
                    <div>
                      <p><span style={{ fontWeight: 'bold' }}>First Name:</span>{'\u00A0'}{'\u00A0'}{data1.Firstname}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Last Name:</span>{'\u00A0'}{'\u00A0'}{data1.Lastname}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Gender:</span>{'\u00A0'}{'\u00A0'}{data1.gender}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Birthday:</span>{'\u00A0'}{'\u00A0'}{data1.birthday}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Email:</span>{'\u00A0'}{'\u00A0'}{data1.email}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Preferred Language:</span>{'\u00A0'}{'\u00A0'}{data1.language}</p>
                      {role === 'lecturer' ? 
                        <p style={{textOverflow: 'ellipsis', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden'}}><span style={{ fontWeight: 'bold' }}>Zoom Link:</span>{'\u00A0'}{'\u00A0'}{data1.zoomlink}</p> 
                      : null}
                    </div>
                    <Link to="/editprofile">
                      <div id="ProfileDetail-Button">
                        <Button type="primary" size="large" style={{width:100}}>
                          Edit
                        </Button>
                      </div>
                    </Link>
                  </Card>
                  {role === 'student' ?
                    <Card
                      title="Enrolment History"
                      bordered={false}
                      style={{
                      width: 360,
                      height: 430,
                      marginLeft: 20,
                      }}
                      >
                      <Timeline
                          pending="More"
                          items={data2}
                      />
                      <Link to="/enrolmenthistory">
                        <div id="ProfileDetail-Button">
                          <Button type="primary" size="large" style={{width:100}}>
                            Detail
                          </Button>
                        </div>
                      </Link>
                    </Card> 
                  :
                  <Card
                      title="Course History"
                      bordered={false}
                      style={{
                      width: 360,
                      height: 430,
                      marginLeft: 20,
                      }}
                      >
                      <Timeline
                          pending="More"
                          items={data2}
                      />
                      <Link to="/enrolmenthistory">
                        <div id="ProfileDetail-Button">
                          <Button type="primary" size="large" style={{width:100}}>
                            Detail
                          </Button>
                        </div>
                      </Link>
                    </Card> 
                  }
                  
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
export default Profile;