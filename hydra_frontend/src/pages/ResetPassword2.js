import React from 'react';
import { Card, Input, Button, Form, message } from 'antd';
import 'antd/dist/reset.css';
import '../styles/ResetPassword2.css';
import { useNavigate } from 'react-router-dom';

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

function ResetPassword2() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = (values) => {
      console.log('Received values of form: ', values);
      messageApi.open({
        type: 'loading',
        content: 'Reseting...',
      });
      fetch('http://localhost:8000/forgetpwd2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            messageApi.destroy();
            messageApi.success('Reset successfully!');
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            messageApi.destroy();
            messageApi.open({
              type: 'error',
              content: data.msg,
              duration: 2,
            });
          }
        });
  };
  
  return (
    <div className="ResetPassword">
      <Card
        id="ResetPassword-Card"
        bordered={false}
        style={{
        width: 900,
        height: 440,
        }}
      >
        <div id="ResetPassword-Title"><span>Reset Password</span></div>
        <div id="ResetPassword-Content">
          <Form id="ResetPassword-Form"
            {...formItemLayout}
            form={form}
            name="edit"
            initialValues={{
                language: 'English',
            }}
            style={{
                maxWidth: 600,
            }}
            scrollToFirstError
            onFinish={onFinish}
            >
            <Form.Item
                name="username"
                label="Username"
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
                name="password"
                label="Password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
                ]}
                hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
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
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item style={{textAlign: 'center', marginLeft: 120, marginTop: 60, marginBottom: -10}}>
              {contextHolder}
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}

export default ResetPassword2;