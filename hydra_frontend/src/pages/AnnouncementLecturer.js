import { useState } from 'react';
import { Button, Modal, Form, Input, message, Layout, Divider, Tooltip} from 'antd';
import Navibar from '../components/Navibar';
import { RollbackOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const AnnouncementPage = () => {
  const cid = localStorage.getItem('cid');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formContent, setFormContent] = useState({ title: '', content: '' });
  const handleOk = (formContent) => {
    console.log('formContent', formContent);
    const request = { cid: cid, title: formContent.title, content: formContent.content}
    console.log('request', request);
    fetch('http://localhost:8000/announcement/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        }).then(async(response) => {
            const jsonRes = await response.json();
            if (response.status !== 200) {
                message.error(jsonRes.error);
                return;
            }
            message.success('Successful!');
        })
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const SectionName = localStorage.getItem('cname') + " —— Announcement";

  return (
    <><Layout
      className="site-layout"
      style={{
        minHeight: '100vh',
        marginLeft: 200,
      }}>
      <Header style={{ padding: '2px 10px' }}>
        <Link to='/DashboardLecturer'>
          <Tooltip title="Back">
            <Button type='link' shape="circle" icon={<RollbackOutlined />} />
          </Tooltip>
        </Link>
        <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{SectionName}</h2>
      </Header>
      <div style={{marginTop: '40px', marginLeft: '77px'}}>
        <Button onClick={() => setIsModalVisible(true)} type="primary" size="large" style={{width: 200, marginRight: 50}}>
          Post Announcement
        </Button>
        <Modal
          title="Announcement"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button form="announcementForm" key="submit" htmlType="submit" type="primary">
              Submit
            </Button>,
          ]}
        >
          <Form
            id="announcementForm"
            onFinish={handleOk}
            onFinishFailed={onFinishFailed}
            initialValues={{ title: '', content: '' }}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input the title of announcement!',
                },
              ]}
              onChange={(e) => setFormContent({ ...formContent, title: e.target.value })}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Content"
              name="content"
              rules={[
                {
                  required: true,
                  message: 'Please input the content of announcement!',
                },
              ]}
              onChange={(e) => setFormContent({ ...formContent, content: e.target.value })}
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Navibar />
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Hydra Learning management system©2023 Created by COMP9900 HYDRA Group
      </Footer>

    </Layout></>
  );
};

export default AnnouncementPage;
