import React from 'react';
import { Button, Layout, theme, Tooltip, Card } from 'antd';
import Navibar from '../components/Navibar';
import { RollbackOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Chatbot from '../components/Chatbot';


const { Header, Content, Footer, Sider } = Layout;

const Coursemainpage = () => {
  const role = localStorage.getItem('role');
  const cname = localStorage.getItem('cname');
  const cdes = localStorage.getItem('cdes');


  const {
      token: { colorBgContainer },
  } = theme.useToken();
  if (role === 'lecturer') {
    return (
    <Layout
      className="site-layout"
      style={{
          minHeight: '100vh',
          marginLeft: 200,
      }}>
        <Header style={{ padding: '2px 10px' }}>
          <Link to='/dashboardlecturer'>
            <Tooltip title="Back">
              <Button type='link' shape="circle" icon={<RollbackOutlined />} />
            </Tooltip>
          </Link>
          <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{cname}</h2>
        </Header>
        <Card title="Course Description" bordered={false} style={{ width:'90%', marginTop: 25, marginLeft:25 }}>
          <p>{cdes}</p>
        </Card>
        <div className='chatbot' style={{margin: '10px 10px 10px 10px'}}>
          <Chatbot />
        </div>
        <Navibar />   
        <Footer
        style={{
            textAlign: 'center',
        }}
      >
          Hydra Learning management system©2023 Created by COMP9900 HYDRA Group
      </Footer>
    </Layout>  
    )} else {
      return (
      <Layout
        className="site-layout"
        style={{
            minHeight: '100vh',
            marginLeft: 200,
      }}>
        <Header style={{ padding: '2px 10px' }}>
          <Link to='/dashboard'>
            <Tooltip title="Back">
              <Button type='link' shape="circle" icon={<RollbackOutlined />} />
            </Tooltip>
          </Link>
          <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{cname}</h2>
        </Header>
        <Card title="Course Description" bordered={false} style={{ width:'90%', marginTop: 25, marginLeft:25 }}>
          <p>{cdes}</p>
        </Card>
        <Chatbot />
        <Navibar />   
        <Footer
        style={{
            textAlign: 'center',
        }}
        >
          Hydra Learning management system©2023 Created by COMP9900 HYDRA Group
        </Footer>
      </Layout>  
      )
    }      
};

export default Coursemainpage;