import React, { useEffect } from 'react';
import { UploadOutlined, UserOutlined, LogoutOutlined, RollbackOutlined } from '@ant-design/icons';
import { Card, Button, Avatar, Upload, message, notification, Space, Layout, Menu, Tooltip } from 'antd';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'antd/dist/reset.css';
import '../styles/EditAvatar.css';
import avatar from '../img/hydra2.png';

const {Header, Content, Footer, Sider} = Layout;

function EditAvatar() {
    const [messageApi, contextHolder1] = message.useMessage();
    const [api, contextHolder2] = notification.useNotification();
    const [ava, setAva] = useState();
    const [defaultAvatar, setDefault] = useState();
    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    //Get avatar
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
        console.log(data);
        if(data.ava === ''){
          setAva(avatar);
          setDefault(avatar);
        }else{
          setAva(data.ava);
          setDefault(data.ava);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }, []);

    //Upload avatar
    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
  
        reader.onload = () => {
          resolve(reader.result);
        };
  
        reader.onerror = (error) => {
          reject(error);
        };
      })
    };

    const multimediaHandler = async (e) => {
      // Get the file obj from the file list
      if (e.fileList[0] === undefined) {
        setAva(avatar);
      }else{
        const file = e.fileList[0].originFileObj;
        const file_base64 = await convertBase64(file);
        setAva(file_base64);
        console.log(file_base64);
      }
    }

    //Save modification
    function handleSave() {
      messageApi.open({
        type: 'loading',
        content: 'Updating...',
      });
      fetch('http://localhost:8000/uploadavatar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: localStorage.uid,
          avatar: ava,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          messageApi.destroy();
          messageApi.success("Success!")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        messageApi.destroy();
        messageApi.error("Cannot connect to the server")
      });
    }

    //Cancel modification
    const confirmCancel = () => {
      navigate(role === 'student'?'/dashboard':'/dashboardlecturer');
    };

    function handleCancel(){
      const key = `open${Date.now()}`;
      const btn = (
        <Space>
          <Button  type="primary" size="medium" onClick={() => api.destroy()}style={{width:100}}>
            Continue
          </Button>
          <Button size="medium" onClick={confirmCancel} style={{width:100}}>
            Cancel
          </Button>
        </Space>
      );
      api.open({
        message: 'Cancel Confirm',
        description:
          'Are you sure to cancel the modification and exit the current page or continue to modify?',
        btn,
        key,
      });
    }
    
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
                <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>Edit Avatar</h2>
            </Header>
            <Content>
              <div className="ChangeAvatar">
                <Card
                  id="ChangeAvatar-Card"
                  bordered={false}
                  style={{
                  width: 780,
                  height: 470,
                  }}
                >
                  <div id="ChangeAvatar-Avatar">
                    <Avatar shape="square" size={128} src={ava} />
                  </div>
                  <div id="ChangeAvatar-Content">
                    <Upload
                      // This line is to prevent automatic uploading
                      beforeUpload={() => false}
                      onChange={multimediaHandler}
                      maxCount={1}
                      className="upload-list-inline"
                    >
                      <Tooltip placement="bottom" title="File MaxSize is 1.5MB">
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Tooltip>
                    </Upload>
                  </div>
                  <div id="ChangeAvatar-Submit">
                    {contextHolder1}
                    <Button type="primary" onClick={handleSave} size="large" style={{width: 100}}>Update</Button>
                    {contextHolder2}
                    <Button id="ChangeAvatar-Cancel" onClick={handleCancel} size="large" style={{width: 100}}>Cancel</Button>
                  </div>
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

export default EditAvatar;