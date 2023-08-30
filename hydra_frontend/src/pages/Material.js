import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Select, Upload, message, Layout, Tooltip, Pagination} from 'antd';
import {useNavigate, Link} from 'react-router-dom';
import { UploadOutlined, RollbackOutlined } from '@ant-design/icons';
import { Document, Page } from "@react-pdf/renderer";
import PostAnnouncement from '../components/PostAnnouncement';
import 'antd/dist/reset.css';
import '../styles/Material.css';
import Navibar from '../components/Navibar';
import token from "../utility/token"

const { Header, Content, Footer } = Layout;

function Material() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    
    const role = localStorage.getItem('role');

    const jsonToPost = (material_data) => {
      const material_list = material_data.map(m => {
        const urlObj = new URL(m.filepath);
        return {
          mid: m.mid,
          type: m.type,
          filename: urlObj.pathname.split('/').pop().replace(/%20/g, ' '),
          filepath: m.filepath,
      }});
      return material_list;
    }

    useEffect(() => {
      fetch('http://localhost:8000/showmaterial/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: localStorage.cid,
          uid: localStorage.uid
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const material_data = data.material;
          console.log(material_data);
          setData(jsonToPost(material_data));
        });
    }, []);

    //tablesetting
    const columns = [
        {
            title: 'Material Type',
            dataIndex: 'type',
            filters: [
              {
                text: 'PDF',
                value: 'PDF',
              },
              {
                text: 'ZIP',
                value: 'ZIP',
              },
              {
                text: 'MP4',
                value: 'MP4',
              },
            ],
            filterMode: 'tree',
            filterSearch: true,
            sorter: {
                compare: (a, b) => a.type.localeCompare(b.type),
            },
            onFilter: (value, record) => record.type.startsWith(value),
            width: '30%',
        },
        {
            title: 'Material',
            dataIndex: 'filename',
            sorter: {
                compare: (a, b) => a.filename.localeCompare(b.filename),
            },
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
    const onChangeFilter = (pagination, filters, sorter, extra) => {
      console.log('params', pagination, filters, sorter, extra);
    };

    //create a new material
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form, setForm] = useState({
      type: "",
      filepath: ""
    });

    const showModal = () => {
      setOpen(true);
    };

    // Upload to the backend
    const handleOk = () => {
      console.log(form);
      setConfirmLoading(true);
      fetch('http://localhost:8000/uploadmaterial/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: localStorage.cid,
          type: form.type,
          filepath: form.filepath
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === 200) {
            setTimeout(() => {
              setOpen(false);
              setConfirmLoading(false);
              PostAnnouncement('material');
              
            }, 2000);
            setTimeout(() => {
              window.location.reload();
            }, 3500);
          }
          // TODO: if upload failed, show error message
        });
    };

    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };

    const handleChange = (value) => {
      console.log(`selected ${value}`);
      setForm({...form, type: value})
    };

    const uploadProps = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      maxCount: 1,
      onChange(info) {
        // Upload the file to Google
        const f = info.file.originFileObj;
        console.log(f)
        fetch(`https://storage.googleapis.com/upload/storage/v1/b/9900hydra/o?uploadType=media&name=${f.name}`, {
          method: 'POST',
          headers: {
            'Content-Type': f.type,
            'Authorization': `Bearer ${token}`
          },
          body: f
        })
        .then(res => res.json())
        .then((data) => {
          console.log(data)
          setForm({...form, filepath: `https://storage.googleapis.com/9900hydra/${f.name}`})
        })
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    const SectionName = localStorage.getItem('cname') + " —— Material";

    return (
      <Layout
        className="site-layout"
        style={{
            height: '100vh',
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
              <div className="Material-Content">
                <div className="Material-Filter">
                  {role !== 'student' &&
                    <Button type="primary" htmlType="submit" size="large" style={{width: 160, marginRight: 50}} onClick={showModal}>Upload a material</Button>
                  }
                  <Modal
                    title="Upload a material"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                  >
                    <div className="Upload-Content">
                      <div className="Upload-Type">
                        <span style={{fontSize: 16}}>Material Type:</span>
                        <Select
                          style={{
                            width: 120,
                            marginLeft: 25,
                          }}
                          onChange={handleChange}
                          options={[
                            {
                              value: 'PDF',
                              label: 'PDF',
                            },
                            {
                              value: 'ZIP',
                              label: 'ZIP',
                            },
                            {
                              value: 'MP4',
                              label: 'MP4',
                            },
                          ]}
                        />
                      </div>
                      <div className="Upload-File">
                        <Upload {...uploadProps}>
                          <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                      </div>
                    </div>
                  </Modal>
                </div>
                <div className="Material-List">
                    <Table 
                      rowKey={"mid"}
                      columns={columns} 
                      dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)} 
                      onChange={onChangeFilter}
                      pagination={paginationConfig}
                      onRow={(record) => {
                        return {
                          onClick: event => {
                            window.location.assign(record.filepath)
                          },
                        };
                      }}
                    />
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
export default Material;