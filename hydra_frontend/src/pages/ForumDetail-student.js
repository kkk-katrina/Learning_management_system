import React, { useEffect, useState } from 'react';
import { LikeOutlined, PushpinOutlined, RollbackOutlined } from '@ant-design/icons';
import { Input, Button, Descriptions, Badge, message, notification, Space, Layout, Tooltip } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navibar from '../components/Navibar';
import 'antd/dist/reset.css';
import '../styles/ForumDetail-student.css';

const { TextArea } = Input;
const { Header, Content, Footer } = Layout;


function ForumDetailStudent() {
  const [messageApi1, contextHolder1] = message.useMessage();
  const [messageApi2, contextHolder3] = message.useMessage();
  const [api1, contextHolder2] = notification.useNotification();
  const [data, setData] = useState(undefined);
  const [reply, setReply] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const { pid } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Receive post data from the backend
  useEffect(() => {
    fetch('http://localhost:8000/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: pid
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, [pid]);

  //set components
  const propsEdit = {
    display: 'none'
  }

  const propsLike = {
    fontSize: 23,
    cursor: 'pointer',
  }

  const propsFlag = {
    fontSize: 27,
    marginLeft: 30,
    cursor: 'pointer',
  }

  const propsPrivate = {
    width: 80, 
    marginRight: 30,
    display: 'none'
  }

  const propsDelete = {
    width: 80, 
    marginRight: 30,
    display: 'none'
  }

  const propsChange = {
    width: 80, 
    marginRight: 30,
    display: 'none'
  }

  let privatecontent = ""
  let PostDetail = "No Data"

  if (data) {
    PostDetail = data ? data.content : "No data";
    // Give different text if the post is translated 
    if (isTranslated) {
      PostDetail = data.translation;
    }
    if (data.editted) {
      propsEdit.display = 'block';
    }
    if (data.likes.likes.includes(localStorage.getItem('uid'))) {
      propsLike.color = 'red';
    }
    if (data.flagged.includes(localStorage.getItem('uid'))) {
      propsFlag.color = 'blue';
    }
    if (!data.privacy) {
      privatecontent = "Private"
    }
    if (data.privacy) {
      privatecontent = "Public"
    }
    if (parseInt(localStorage.getItem("uid")) === data.creatorid) {
      propsChange.display = 'block';
    }
    if (role !== "student" || parseInt(localStorage.getItem("uid")) === data.creatorid) {
      propsPrivate.display = 'block';
      propsDelete.display = 'block';
    }
  }

  function handleLike() {
    if (data.likes.likes.includes(localStorage.getItem('uid'))) {
      let likedata = { ...data };
      likedata.likes.likes = data.likes.likes.filter(uid => uid !== localStorage.getItem('uid'))
      setData(likedata)
    } else {
      let likedata = { ...data };
      likedata.likes.likes.push(localStorage.getItem('uid'))
      setData(likedata)
    }
    fetch('http://localhost:8000/likeposts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: pid,
        uid: localStorage.getItem('uid')
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
        }
      });
  }

  function handleFlag() {
    if (data.flagged.includes(localStorage.getItem('uid'))) {
      let flagdata = { ...data };
      flagdata.flagged = data.flagged.filter(uid => uid !== localStorage.getItem('uid'))
      setData(flagdata)
    } else {
      let flagdata = { ...data };
      flagdata.flagged.push(localStorage.getItem('uid'))
      setData(flagdata)
    }
    fetch('http://localhost:8000/flagposts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: pid,
        uid: localStorage.getItem('uid')
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
        }
      });
  }

  function makePrivate() {
    if (data.privacy) {
      let privatedata = { ...data };
      privatedata.privacy = "False"
      setData(privatedata)
    } else {
      let privatedata = { ...data };
      privatedata.privacy = "True"
      setData(privatedata)
    }
    console.log("makePrivate");
    fetch('http://localhost:8000/setprivate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: pid,
        uid: localStorage.getItem('uid')
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
        } else {
          console.log(data);
        }
      });
  }

  function deletePost() {
    console.log("deletePost");
    api1.destroy();
    messageApi1.open({
      type: 'loading',
      content: 'Deleting...',
      duration: 2,
    });
    fetch('http://localhost:8000/deleteposts/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pid: pid,
        uid: localStorage.getItem('uid')
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          messageApi1.destroy();
          messageApi1.open({
            type: 'success',
            content: 'Deleted!',
          });
          setTimeout(() => {
            navigate('/coursemainpage/forum');
          }, 1500);
        }
      })
      .catch((error) => {
        messageApi1.destroy();
        messageApi1.error("Cannot connect to the server")
        console.error(error);
      })
  }

  //delete post confirm
  function handleDelete() {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="primary" size="medium" onClick={() => api1.destroy()} style={{ width: 100 }}>
          Continue
        </Button>
        <Button size="medium" onClick={deletePost} style={{ width: 100 }}>
          Delete
        </Button>
      </Space>
    );
    api1.open({
      message: 'Delete Confirm',
      description:
        'Are you sure to delete the post?',
      btn,
      key,
    });
  }

  //edit post
  function handleEdit() {
    console.log("edit");
    navigate('/coursemainpage/editforum/' + pid);
  }

  async function handleTranslate() {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    // Set the content is translated
    setIsTranslated(true);
    // Request the backend to find the user prefered language
    const targetLan = await fetch('http://localhost:8000/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: localStorage.uid,
      }),
    })
      .then(response => response.json())
      .then((data) => data.language);

    var target = ""
    switch (targetLan) {
      case ("Chinese"):
        target = "zh";
        break;
      case ("German"):
        target = "de";
        break;
      case ("Russain"):
        target = "ru";
        break;
      case ("French"):
        target = "fr";
        break;
      case ("Japanese"):
        target = "ja";
        break;
      default:
        target = "en";
    }

    // Send to google API
    // IMPORTANT: THE API IS HARD CODED AND MAY EXPIRE
    fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyDjnGFmUnXVdGY2CONQhyff3hcPyKsD7ec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Translate according to the user preference
      body: JSON.stringify({
        q: [data.content],
        source: "en",
        target: target? target : "en",
        format: "text"
      }),
    })
      .then(response => response.json())
      .then(received_data => {
        console.log(received_data.data.translations[0].translatedText);
        setData({ ...data, translation: received_data.data.translations[0].translatedText })
      }
      );
  }

  // Handle submit reply
  function handleSubmit() {
    console.log(reply);
    messageApi2.open({
      type: 'loading',
      content: 'Replying...',
    });
    fetch('http://localhost:8000/replyposts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: localStorage.uid,
        pid: pid,
        content: reply
      }),
    })
      .then(response => response.json())
      .then((fetched_data) => {
        if (fetched_data.status === 200) {
          messageApi2.destroy();
          messageApi2.open({
            type: 'success',
            content: 'Replied!',
          });
          const new_data = { ...data };
          new_data.reply.reply.push({
            "Me": [reply]
          })
          setReply("")
          setData(new_data)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // Generate reply list from data
  const reply_components = []
  if (data) {
    data.reply.reply.forEach((e) => console.log(Object.keys(e)[0], Object.values(e)[0]))
    data.reply.reply.forEach((e) => {
      reply_components.push(
        <div className="ForumDetail-Reply">
          <Descriptions>
            <Descriptions.Item label="Reply from" span={3}>{Object.keys(e)[0]}</Descriptions.Item>
            <Descriptions.Item label="Content" span={3}>
              {Object.values(e)[0]}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )
    })
  }

  // Render multimedia
  let media_compnent = undefined
  if (data) {
    media_compnent = data.multimedia ? <img src={data.multimedia} alt="avatar" style={{ width: '50%' }} /> : <></>
  }

  const SectionName = localStorage.getItem('cname') + " —— Post Detail";

  return (
    <Layout
      className="site-layout"
      style={{
          minHeight: '100vh',
          marginLeft: 200,
      }}>
        <Header style={{ padding: '2px 10px' }}>
          <Link to='/coursemainpage/forum'>
              <Tooltip title="Back">
                <Button type='link' shape="circle" icon={<RollbackOutlined />} />
              </Tooltip>
          </Link>
          <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{SectionName}</h2>
        </Header>
        <Content>
          <div className="ForumDetail-Total">
            <div className="ForumDetail-Post">
              <Descriptions title={data ? data.title : "No data"}>
                <Descriptions.Item label="Creator" span={2}>{data ? data.creatorname : "No data"}</Descriptions.Item>
                <Descriptions.Item label="Post Time">{data ? data.createtime.slice(0, 10) : "No data"}</Descriptions.Item>
                <Descriptions.Item label="Keyword" span={2}>{data ? data.keyword : "No data"}</Descriptions.Item>
                <Descriptions.Item span={1} style={{ float: 'right' }}>
                  <Tooltip placement="bottom" title="Translate to your prefered language">
                    <Button htmlType="submit" size="small" style={{ width: 80, marginRight: 30 }} onClick={handleTranslate}>{isTranslated ? "Undo" : "Translate"}</Button>
                  </Tooltip>
                </Descriptions.Item>
                <Descriptions.Item label="Content" span={3}>
                  {PostDetail}
                </Descriptions.Item>
                <Descriptions.Item span={2}>
                  {media_compnent}
                </Descriptions.Item>
                <Descriptions.Item span={1} style={{ float: 'right', marginRight: 30 }}>
                  <p style={propsEdit}>edited</p>
                </Descriptions.Item>
                <Descriptions.Item span={2}>
                  <Badge size="small" count={data ? data.likes.likes.length : 0}>
                    <LikeOutlined style={propsLike} onClick={handleLike} />
                  </Badge>
                  <PushpinOutlined style={propsFlag} onClick={handleFlag} />
                </Descriptions.Item>
                <Descriptions.Item >
                  {contextHolder2}
                  {contextHolder1}
                  <Button type="primary" htmlType="submit" size="medium" style={propsDelete} onClick={handleDelete}>Delete</Button>
                  <Button type="primary" htmlType="submit" size="medium" style={propsPrivate} onClick={makePrivate}>{privatecontent}</Button>
                  <Button type="primary" htmlType="submit" size="medium" style={propsChange} onClick={handleEdit}>Edit</Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
            {reply_components}
            <div className="ForumDetail-Reply">
              <TextArea rows={2} placeholder="Please input the reply" value={reply} onChange={(e) => { setReply(e.target.value) }} />
              {contextHolder3}
              <Button type="primary" htmlType="submit" size="medium" style={{ marginLeft: 30 }} onClick={handleSubmit}>Reply</Button>
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
export default ForumDetailStudent;