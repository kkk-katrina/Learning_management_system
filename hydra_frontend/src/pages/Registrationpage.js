import { useNavigate, Link } from 'react-router-dom';
import '../styles/registrationpage.css';
import {
  Button,
  Form,
  Input,
  message,
  Select,
} from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import React from 'react';

const RegistraionFrom = () => {
  let navigate = useNavigate();
  const [messageApi, contextHolder1] = message.useMessage();

  const onFinish = (values) => {
    console.log(values)
    messageApi.loading("Registering...");
    fetch('http://localhost:8000/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.status === 200) {
          messageApi.destroy();
          messageApi.success("Success!")
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }else{
          messageApi.destroy();
          messageApi.error(data.msg);
        }
      });
  };

  return (
    <>
      <Link to="/"><LeftCircleOutlined style={{fontSize: 30, marginLeft: 30, marginTop: 30, color: 'grey'}}/></Link>
      <div className='pagelayout'>
        <div className='registrationcard'>
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              width: 800,
              marginRight: -150
            }}
            onFinish={onFinish}
          >
            <Form.Item 
              label="User name" 
              name="username" 
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              label="Email address" 
              name="email"
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
              label="Password" 
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item 
              label="Confirm password"
              dependencies={['password']}
              name="confirm"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item 
              label="Role: " 
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please select your role!',
                },
              ]}
            >
              <Select>
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="lecturer">Lecturer</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item style={{textAlign: 'center', marginLeft: 120, marginTop: 30, marginBottom: -10}}>
              {contextHolder1}
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default () => <RegistraionFrom />;