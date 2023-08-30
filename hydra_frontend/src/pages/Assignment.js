import React from 'react';
import Navibar from '../components/Navibar';
import pic from '../img/hydra1.png';
import '../styles/Assignment.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout, Tooltip, Upload, Avatar, Card } from 'antd';
import { Button, Modal, Space, Input, message } from 'antd';
import { RollbackOutlined, UploadOutlined, FundOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Assignment() {
    const { Header, Content, Footer, Sider } = Layout;
    const { TextArea } = Input;
    const { Meta } = Card;
    const role = localStorage.getItem('role');    
    const cid = localStorage.getItem('cid');    
    const aid = localStorage.getItem('aid');
    const SectionName = localStorage.getItem('cname') + " —— Assignment";

    //Create Assignment Modal   
    const [loading, setLoading] = useState(false); 
    const [open, setOpen] = useState(false); 
    //Open different modal
    const [currentModal, setCurrentModal] = useState('');

    const openModal = (modalId) => {
        setCurrentModal(modalId);
        setOpen(true);
    };

    const closeModal = () => {
        setCurrentModal('');
        setOpen(false);
    };

    //Post assignment info
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [des, setDes] = useState('');

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
        setLoading(false);
        setOpen(false);
        }, 1000);
    };
    


    //Create Assignment
    const handleCreate = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/createass/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cid: cid,
            title: title,
            assdescription: des,
            url: url
        }),
        })
        .then((response) => response.json())
        .then((data)=>{
            if (data.status === 200){
                message.success('Assignment created successfully');
            }
            else{
                message.error('Failed to create assignment');
            }
        })
        setOpen(false);
    };

    //Assignment List
    const [assList, setAssList] = useState([]);
    useEffect(() => {
        axios.post('http://localhost:8000/showass/', {
            cid: cid
        })
        .then((response) => {
            setAssList(response.data.asses);
            localStorage.setItem('aid', response.data.asses[0].aid);
        })
    }, []);

    //Mark Assignment
    const [sid, setSid] = useState([]);
    const [assMark, setAssMark] = useState([]);
    const handleMark = () => {
        axios.post('http://localhost:8000/markass/', {
            cid: cid,
            uid: sid,
            aid: aid,
            mark: assMark
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.data.status === 200){
                message.success('Marked successfully');
            }
            else{
                message.error('Failed to mark');
            }
        })
    };


    //Submit Assignment Modal
    //Upload file
    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        // action: 'https://http://localhost:8000/submitass/',
        headers: {
        authorization: 'authorization-text',
        },
        onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            // message.error(`${info.file.name} file upload failed.`);
            message.success(`${info.file.name} file uploaded successfully`);
        }
        },
    };

    
    if (role === 'lecturer') {
        return (
            <>
            <Layout
            className="site-layout"
            style={{
                minHeight: '100vh',
                marginLeft: 200,
            }}>
            <Header style={{ padding: '2px 10px' }}>
            <Link to='/coursemainpage'>
                <Tooltip title="Back">
                <Button type='link' shape="circle" icon={<RollbackOutlined />} />
                </Tooltip>
            </Link>
            <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{SectionName}</h2>
            </Header>
            <Space style={{marginLeft:'58px', marginBottom:'15px', marginTop: '40px'}}>
                <Button type="primary" size = "large" onClick={() => openModal('modal1')} style={{marginLeft:'20px'}}>Create a new assignment</Button>
                <Modal
                    open={currentModal === 'modal1' && open}
                    id='modal1'
                    title="New assignment"
                    onOk={handleCreate}
                    onCancel={closeModal}
                    footer={[
                    <Button key="back" onClick={closeModal}> Cancel </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleCreate}> Create </Button>,
                    ]}
                >
                    <div style={{fontWeight:'bold', marginLeft:'15px', marginTop:'15px', marginBottom:'20px'}}>
                        Assignment Title:
                        <TextArea placeholder="Input Assignment Title" allowClear autoSize value={title} onChange={(e) => setTitle(e.target.value)} />
                    <br />
                    <br />
                        Assignment Description:
                        <TextArea rows={4} value={des} placeholder="Input Assignment Description" allowClear autoSize onChange={(e) => setDes(e.target.value)} />
                    <br />
                    <br />
                        Assignment Link:
                        <TextArea placeholder="Input Assignment Link" allowClear autoSize value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div>

                </Modal>
            </Space>
            
            {/* show assignemts */}
            <div class="container" style={{marginTop: "15px"}}> 
                {assList.map((ass) => (
                    <div key={ass.pk} class="box">
                        <a href={ass.url}>
                        <Card
                            hoverable
                            style={{
                            width: 300,
                            position: 'relative' 
                            }}
                            cover={
                            <img
                                alt="assignment"
                                src={pic}
                            />
                            }
                        >
                            <Meta
                            title={ass.title}
                            description={ass.assignemntdescription}
                            />
                        </Card>
                        </a>
                        <Button onClick={() => openModal('modal2')} icon={<FundOutlined />} style={{marginTop:'10px'}}>Mark {ass.title} </Button>
                        <Modal
                            open={currentModal === 'modal2'  && open}
                            id='modal2'
                            title="Mark assignment"
                            onOk={handleMark}
                            onCancel={closeModal}
                            footer={[
                            <Button key="back" onClick={closeModal}> Cancel </Button>,
                            <Button key="mark" type="primary" loading={loading} onClick={handleMark}> Mark </Button>,
                            ]}>
                            <div style={{fontWeight:'bold', marginLeft:'15px', marginTop:'15px', marginBottom:'20px'}}>
                                Student ID:
                                <Input allowClear value={sid} onChange={(e) => setSid(e.target.value)}/>
                            <br />
                            <br />
                                Grade: (Marks out of 15)
                                <Input allowClear value={assMark} onChange={(e) => setAssMark(e.target.value)}/>
                            </div>
                        </Modal>
                    </div>
                ))}
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
            </>
            
    )} else { //role = student
        return (
            <>
            <Layout
            className="site-layout"
            style={{
                minHeight: '100vh',
                marginLeft: 200,
            }}>
            <Header style={{padding:'2px 10px'}} >
                <Link to='/coursemainpage'>
                <Tooltip title="Back">
                    <Button type='link' shape="circle" icon={<RollbackOutlined />} />
                </Tooltip>
                </Link>
                <h2 style={{display: 'inline-block', marginLeft: '20px', color:'white'}}>{SectionName}</h2>
            </Header>
            <div class="container"> 
                {assList.map((ass) => (
                    <div key={ass.pk} class="box">
                        <a href={ass.url}>
                        <Card
                            hoverable
                            style={{
                            width: 300,
                            position: 'relative' 
                            }}
                            cover={
                            <img
                                alt="assignment"
                                src={pic}
                            />
                            }
                        >
                            <Meta
                            title={ass.title}
                            description={ass.assignemntdescription}
                            />
                        </Card>
                        </a>
                        <Button onClick={() => openModal('modal3')} icon={<FundOutlined />} style={{marginTop:'10px'}}>Submit {ass.title} </Button>
                        <Modal
                            open={currentModal === 'modal3'  && open}
                            id='modal3'
                            title="Assignment submission"
                            onOk={handleSubmit}
                            onCancel={closeModal}
                            footer={[
                            <Button key="back" onClick={closeModal}> Cancel </Button>,
                            <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}> Submit </Button>,
                            ]}>
                            <div style={{fontWeight:'bold', marginLeft:'15px', marginTop:'15px', marginBottom:'20px'}}>
                                <p>Please name file as 'xxx.pdf' ('xxx' is your student id)</p>
                                <Upload {...props}>
                                    <Button icon={<UploadOutlined />}>Upload Files</Button>
                                </Upload>                               
                            </div>
                        </Modal>
                    </div>
                ))}
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
            </>
        )
    }
    
}

