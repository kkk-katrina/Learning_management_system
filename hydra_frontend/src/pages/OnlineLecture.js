import React, { useState, useEffect } from 'react';
import { Button, Table, message, Space, Tooltip, Modal, Typography, Layout} from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';
import FileSaver from 'file-saver';
import 'antd/dist/reset.css';
import '../styles/OnlineLecture.css';
import Navibar from '../components/Navibar';

const { Header, Content, Footer, Sider } = Layout;

function OnlineLecture() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const role = localStorage.getItem('role');

    // const [data, setData] = useState([]);

    // const jsonToPost = (material_data) => {
    //   const material_list = material_data.map(l => {
    //     const urlObj = new URL(l.filepath);
    //     return {
    //       lid: l.lid,
    //       filename: urlObj.pathname.split('/').pop().replace(/%20/g, ' '),
    //       filepath: l.filepath,
    //   }});
    //   return material_list;
    // }

    // useEffect(() => {
    //   fetch('http://localhost:8000/showmaterial/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       cid: localStorage.cid,
    //       uid: localStorage.uid
    //     }),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const material_data = data.material;
    //       console.log(material_data);
    //       setData(jsonToPost(material_data));
    //     });
    // }, []);

    const data = [
        {
            key: '1',
            lecturename: '1',
            lecturepath: 'https://www.youtube.com/watch?v=1Q8fG0TtVAY',
            attendance: ["1","2"],
        },
        {
            key: '2',
            lecturename: '2',
            lecturepath: 'https://www.youtube.com/watch?v=1Q8fG0TtVAY',
            attendance: ["1","2"]
        },
        {
            key: '3',
            lecturename: '3',
            lecturepath: 'https://www.youtube.com/watch?v=1Q8fG0TtVAY',
            attendance: ["1","2"]
        },
    ];

    function handleUpload(record){
        //TODO: upload to material section
        console.log("Upload");
    }

    function handleCheck(record){
        console.log("Check Attendance");
        showModal(record);
    }

    //tablesetting
    const columns = [
        {
            title: 'Online Lecture',
            dataIndex: 'lecturename',
            ellipsis: true, 
            tooltip: true,
            width: '65%',
            sorter: {
                compare: (a, b) => a.lecturename.localeCompare(b.lecturename),
            },
        },
        {
            key: 'upload',
            width: '15%',
            align: 'center',
            render: (record) => (
                <Space 
                    size="middle"
                    onClick={() => handleUpload(record)}
                    style={{ cursor: 'pointer' }}
                >
                    <Tooltip placement="bottom" title="Upload recording to Material Section">
                        <a>Upload</a>    
                    </Tooltip>    
                </Space>
            ),
        },
        {
            key: 'check',
            width: '20%',
            align: 'center',
            render: (record) => (
                <Space 
                    size="middle"
                    onClick={() => handleCheck(record)}
                    style={{ cursor: 'pointer' }}
                >
                    <Tooltip placement="bottom" title="Check student attendance">
                        <a>Attendance</a>    
                    </Tooltip> 
                </Space>
            ),
        },
      ];

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: data.length,
        onChange: handlePageChange
    };

    //tablefilter
    const onChangeFilter = (pagination, sorter, extra) => {
      console.log('params', pagination, sorter, extra);
    };

    const [open, setOpen] = useState(false);
    const [modalText, setModalText] = useState();
    const [lectureName, setLectureName] = useState();

    const showModal = (record) => {
        //TODO: get the attendance list
        const text = record.attendance.join('\t');
        setModalText(text);
        setLectureName(record.lecturename);
        setOpen(true);
    };

    const handleOk = () => {
        const lines = modalText.split('\t');
        const csvContent = lines.map(line => `"${line}"`).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const filename = `${lectureName}-Attandence.csv`;
        FileSaver.saveAs(blob, filename);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleStartLive = () => {
        fetch('http://localhost:8000/startlivestream/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: localStorage.getItem('uid')
            }),
        })
        .then(res => res.json())
        .then(data => {
            window.location.assign(data.zoomlink)
        })
    }

    const handleShowLive = () => {
        fetch('http://localhost:8000/showlive/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cid: localStorage.getItem('cid')
            }),
        })
        .then(res => res.json())
        .then(data => {
            window.location.assign(data.zoomlink)
        })
    }

    const CourseMsg = "This live is for lecture 1";
    const SectionName = localStorage.getItem('cname') + " —— Online Lecture";

    return (
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
            <Content>
                <div className="OnlineLecture-Content">
                    <div className="OnlineLecture-Create">
                        {role !== 'student' ?
                            <Tooltip placement="right" title="Don't forget to start record the online lecture!">
                                <Button type="primary" htmlType="submit" size="large" style={{width: 160, marginRight: 50}} onClick={handleStartLive}>Start a live stream</Button>
                            </Tooltip>
                        :
                            <Tooltip placement="bottom" title={CourseMsg}>
                                <Button type="primary" htmlType="submit" size="large" style={{width: 200, marginRight: 50}} onClick={handleShowLive}>Join a live stream</Button>
                            </Tooltip>
                        }    
                    </div>
                    <div className="OnlineLecture-List">
                        {role !== 'student' &&
                            <Table 
                                // rowKey={"lid"}
                                columns={columns} 
                                dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} 
                                onChange={onChangeFilter}
                                pagination={paginationConfig}
                            />
                        }
                        <Modal
                            title="Student Attendance"
                            open={open}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            okText="Download"
                            cancelText="Close"
                        >
                            <div style={{ width: '450px', maxHeight: '250px', overflowY: 'auto', margin: '30px 10px 30px 10px' }}>
                                <Typography.Text style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
                                    {modalText}
                                </Typography.Text>
                            </div>
                        </Modal>
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
export default OnlineLecture;
