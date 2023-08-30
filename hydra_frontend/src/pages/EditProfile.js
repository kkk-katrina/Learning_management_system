import React, {useState, useEffect} from 'react';
import { UserOutlined, LogoutOutlined, RollbackOutlined } from '@ant-design/icons';
import { Input, Button, Avatar, Form, Select, DatePicker, Card, message, notification, Space, Layout, Menu, Tooltip } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import '../styles/EditProfile.css';
import avatar from '../img/hydra2.png';
const { Option } = Select;

const {Header, Content, Footer, Sider} = Layout;

//form setting
const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

function EditProfile() {
  //form
  const [messageApi, contextHolder1] = message.useMessage();
  const [api, contextHolder2] = notification.useNotification();
  const [defaultAvatar, setDefault] = useState();
  const navigate = useNavigate();
  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select time!',
      },
    ],
  };

  //get user info
  const [data, setData] = useState([]);
  const role = localStorage.getItem('role');
  
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
      .then((data) => {
        // console.log(data)
        setData(data);
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

  const [form] = Form.useForm();
  const initialValues = {
    firstname: data.Firstname,
    lastname: data.Lastname,
    gender: data.gender,
    birthday: dayjs(data.birthday),
    email: data.email,
    language: data.language,
    zoomlink: data.zoomlink,
  }

  form.setFieldsValue(initialValues);

  //submit modify
  const onFinish = (fieldsValue) => {
    // Should format date value before submit.
    const values = {
      ...fieldsValue,
      'date-picker': fieldsValue['birthday'].format('YYYY-MM-DD'),
    };
    if(values.zoomlink === undefined){
      values.zoomlink = '';
    }
    console.log('Received values of form: ', values);

    api.destroy();
    messageApi.open({
      type: 'loading',
      content: 'Updating...',
    });

    fetch('http://localhost:8000/editprofile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: localStorage.uid,
        firstname: values.firstname,
        lastname: values.lastname,
        gender: values.gender,
        birthday: values["date-picker"],
        email: values.email,
        preferedlanguage: values.language,
        zoomlink: values.zoomlink,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status === 200) {
          messageApi.destroy();
          messageApi.open({
            type: 'success',
            content: 'Updated!',
            duration: 2,
          });
          setTimeout(() => {
            navigate('/profile');
          }, 2100);
        }
      })
      .catch((error) => {
        messageApi.destroy();
        messageApi.error("Cannot connect to the server")
        console.error(error);
      })
  };

  //cancel modify
  const confirmCancel = () => {
    navigate('/profile');
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
                <Link to='/profile'>
                    <Tooltip title="Back">
                    <Button type='link' shape="circle" icon={<RollbackOutlined />} />
                    </Tooltip>
                </Link>
                <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>Edit Profile</h2>
            </Header>
            <Content>
              <div id="EditProfile-Content">
                <Card
                  bordered={false}
                  style={{
                  width: 780,
                  height: 500,
                  }}
                >
                  <Form
                  {...formItemLayout}
                  form={form}
                  name="edit"
                  initialValues={initialValues}
                  onFinish={onFinish}
                  style={{
                      maxWidth: 600,
                      marginTop: 15,
                  }}
                  scrollToFirstError
                  >
                    <Form.Item
                      name="firstname"
                      label="Firstname"
                      rules={[
                      {
                          required: true,
                          message: 'Please input your firstname!',
                          whitespace: true,
                      },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="lastname"
                      label="Lastname"
                      rules={[
                      {
                          required: true,
                          message: 'Please input your lastname!',
                          whitespace: true,
                      },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="gender"
                      label="Gender"
                      rules={[
                      {
                          required: true,
                          message: 'Please select gender!',
                      },
                      ]}
                    >
                      <Select placeholder="select your gender">
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="birthday" label="Birthday" {...config}>
                      <DatePicker />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="E-mail"
                      rules={[
                      {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                      },
                      {
                          required: true,
                          message: 'Please input your E-mail!',
                      },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="language"
                      label="Language"
                      rules={[
                      {
                          required: true,
                          message: 'Please select preferred language!',
                      },
                      ]}
                    >
                      <Select placeholder="select preferred language">
                        <Option value="Chinese">Chinese</Option>
                        <Option value="English">English</Option>
                        <Option value="French">French</Option>
                        <Option value="German">German</Option>
                        <Option value="Japanese">Japanese</Option>
                        <Option value="Russian">Russian</Option>
                      </Select>
                    </Form.Item>
                    
                    {role === 'lecturer' &&
                      <Form.Item
                        name="zoomlink"
                        label="Zoom Link"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your zoom link!',
                        },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    }

                    <Form.Item {...tailFormItemLayout}>
                      <div id="EditProfile-Submit">
                        {contextHolder1}
                        <Button type="primary" htmlType="submit" size="large" style={{width: 100}}>Update</Button>
                        {contextHolder2}
                        <Button id="EditProfile-Cancel" size="large" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </Form.Item>
                  </Form>
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

export default EditProfile;