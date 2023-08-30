import { useState } from 'react';
import { Input, Button, Upload, message, notification, Space, Layout, Tooltip } from 'antd';
import { UploadOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import 'antd/dist/reset.css';
import '../styles/CreateForum.css';
import Navibar from '../components/Navibar';
const { TextArea } = Input;

const { Header, Content, Footer } = Layout;

function CreateForum() {
  const [messageApi, contextHolder1] = message.useMessage();
  const [api, contextHolder2] = notification.useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    keyword: "",
    multimedia: ""
  });

  // Conver the img into base64
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

  // Function to handle changes in multimedia
  const multimediaHandler = async (e) => {
    // Get the file obj from the file list
    const file = e.fileList[0].originFileObj;
    const file_base64 = await convertBase64(file);
    setForm({...form, multimedia: file_base64});
    console.log(file_base64);
  }

  // Function to handle creating a new post
  const onFinish = () => {
    console.log(form);

    // If the title is empty, show error message
    if (form.title === '' || form.keyword === '') {
      messageApi.destroy();
      messageApi.error("Title or keyword cannot be empty");
      return;
    }
    // The loading button always present until success/failure
    messageApi.loading("Uploading to server...");

    fetch('http://localhost:8000/createposts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creatorid: localStorage.uid,
        cid: localStorage.cid,
        title: form.title,
        content: form.content,
        keyword: form.keyword,
        multimedia: form.multimedia,
      }),
    })
      .then(response => response.json())
      // If the post is successfully created, navigate the user to the forum page
      .then(data => {
        console.log(data);
        if (data.status === 200) {
          messageApi.destroy();
          messageApi.success("Success!")
          setTimeout(() => {
            navigate('/coursemainpage/forum/' + data.pid);
          }, 1500);
        }
      })
      .catch((error) => {
        messageApi.destroy();
        messageApi.error("Cannot connect to the server")
        console.log(error);
      })
  };

  // Control the button to cancle post creation
  const confirmCancel = () => {
    navigate('/coursemainpage/forum');
  };

  function handleCancel() {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button danger type="primary" size="medium" onClick={confirmCancel} style={{ width: 100 }}>
          Continue
        </Button>
        <Button size="medium" onClick={() => api.destroy()} style={{ width: 100 }}>
          Cancel
        </Button>
      </Space>
    );
    api.open({
      message: 'Cancel Confirm',
      description:
        'Are you sure to exit the current page?',
      btn,
      key,
    });
  }
  
  const SectionName = localStorage.getItem('cname') + " —— Create Post";

  return (
    <Layout
      className="site-layout"
      style={{
          minHeight: '100vh',
          marginLeft: 200,
      }}>
        <Header style={{ padding: '2px 10px' }}>
          <Link to={'/coursemainpage/forum/'}>
              <Tooltip title="Back">
                <Button type='link' shape="circle" icon={<RollbackOutlined />} />
              </Tooltip>
          </Link>
          <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{SectionName}</h2>
        </Header>
        <Content>
          <div className="CreateForum-Content">
            <div className="Create-Title">
              <span style={{ marginRight: 20 }}>Title</span>
              <Input placeholder="Please input a post title" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }) }} />
            </div>
            <div className="Create-Content">
              <TextArea rows={6} placeholder="Please input post content" value={form.content} onChange={(e) => { setForm({ ...form, content: e.target.value }) }} />
            </div>
            <div className="Create-File">
              <Upload
                // This line is to prevent automatic uploading
                beforeUpload={() => false}
                onChange={multimediaHandler}
                listType="picture"
                maxCount={1}
                className="upload-list-inline"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
            <div className="Create-Button">
              <span style={{ marginRight: 20 }}>Keyword</span>
              <Input placeholder="Please input a keyword" style={{ width: 180 }} value={form.keyword} onChange={(e) => { setForm({ ...form, keyword: e.target.value }) }} />
              {contextHolder2}
              <Button size="large" style={{ width: 100, float: 'right', marginRight: 20, marginTop: -10 }} onClick={handleCancel}>Cancel</Button>
              {contextHolder1}
              <Button type="primary" htmlType="submit" size="large" style={{ width: 100, float: 'right', marginRight: 20, marginTop: -10 }} onClick={onFinish}>Post</Button>
            </div>
          </div>
        </Content>
        <Navibar />   
        <Footer
          style={{
              textAlign: 'center',
          }}
        >
          Hydra Learning management system©2023 Created by COMP9900 HYDRA Group
        </Footer>
      </Layout>
  );
}
export default CreateForum;