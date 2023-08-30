import '../styles/loginpage.css';
import pic from '../img/hydra1.png';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as React from 'react'

export default function Loginpage() {

    let navigate = useNavigate();
    const [messageApi, contextHolder1] = message.useMessage();

    const routeChange = () => {
        navigate("/register");
    }

    const onFinish = (values) => {
        fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    localStorage.setItem('uid',data.uid);
                    localStorage.setItem('role', data.role);
                    console.log(data.uid)
                    if (data.role === 'lecturer') {
                        navigate("/dashboardlecturer");
                    } else {
                        navigate("/dashboard");
                    }
                }else{
                    messageApi.open({
                        content: data.msg,
                        type: 'error',
                    });
                }
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const resetPassword = () => {
        navigate("/resetpassword/1");
    }

    return (
        <>
            <div className='loginpage'>
                <div className="logincard">
                    <img src={pic} style={{maxWidth: '300px', marginTop: -25}}/>    
                    <Form
                        name="basic"
                        style={{
                            maxWidth: 600,
                            margin: 'auto',
                            marginTop: -28,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
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
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                            style={{textAlign: 'left'}}
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item
                        >
                            <div style={{display:'flex', justifyContent: 'space-evenly'}}>
                            {contextHolder1}
                            <Button type="primary" htmlType="submit" style={{marginRight: 15}}>
                                Sign In
                            </Button>
                            <Button onClick={routeChange} style={{marginLeft: 15}}>Register</Button>
                            </div>
                        </Form.Item>

                        <Form.Item
                        >
                            <div style={{textAlign: 'right', marginRight: 20, marginTop: -30}}>
                                <a onClick={resetPassword}>Forget password?</a>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}
