import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Checkbox, Table, Layout, Tooltip, Pagination } from 'antd';
import { useNavigate, Link, json } from 'react-router-dom';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import '../styles/Forum.css';
import Navibar from '../components/Navibar';
import { RollbackOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;

function Forum() {  
  // FUnction to fetch meta data of all post from server
  const fetch_post_data = (postid, creatorid) => {
    navigate('/coursemainpage/forum/' + postid);
  }

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const role = localStorage.getItem('role');

  const getKeyWords = () => {
    const key_list = data.map(p => {
      return {
        text: p.keyword,
        value: p.keyword,
      }
    })
    return key_list;
  }

  //tablesetting
  const columns = [
    {
      title: 'Post Title',
      dataIndex: 'posttitle',
      sorter: {
        compare: (a, b) => a.posttitle.localeCompare(b.posttitle),
        // Multiplier is used for sorting attribute priority
        multiply: 5,
      },
    },
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      filters: getKeyWords(),
      filterMode: 'tree',
      filterSearch: true,
      sorter: {
        compare: (a, b) => a.keyword.localeCompare(b.keyword),
        multiply: 4,
      },
      onFilter: (value, record) => record.keyword.startsWith(value),
      width: '30%',
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      sorter: {
        compare: (a, b) => a.creator.localeCompare(b.creator),
        multiply: 3,
      },
    },
    {
      title: 'Post Time',
      dataIndex: 'posttime',
      sorter: {
        compare: (a, b) => new Date(a.posttime) - new Date(b.posttime),
        multiply: 2,
      },
    },
    {
      title: 'Number of Likes',
      dataIndex: 'numberoflikes',
      sorter: {
        compare: (a, b) => a.numberoflikes - b.numberoflikes,
        multiply: 1,
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
    total: tabledata.length,
    onChange: handlePageChange
  };

  // Function that convert json data into post list
  const jsonToPost = (posts_data) => {
    const post_list = posts_data.map(p => {
      if (!p.privacy || p.creatorid === parseInt(localStorage.getItem('uid')) || localStorage.getItem('role') === 'lecturer') {
        return {
          postid: p.pid,
          posttitle: p.title,
          keyword: p.keyword,
          creator: p.creatorname,
          creatorid: p.creatorid,
          posttime: p.createtime.slice(0, 10),
          numberoflikes: p.likes.likes.length,
          flagged: p.flagged.flagged,
        }
      }else{
        return null;
      }
    }).filter((item) => item !== null);;
    console.log(post_list);
    return post_list;
  }

  // This function run only once to fetch the post data
  useEffect(() => {
    fetch('http://localhost:8000/forum/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: localStorage.cid,
        uid: localStorage.uid
      }),
    })
      .then(response => response.json())
      .then(data => {
        const posts_data = data.posts;
        setData(jsonToPost(posts_data));
        setTableData(jsonToPost(posts_data));
      });
  }, [])

  //forumpostdate
  const onRangeChange = (dates, dateStrings) => {
    const datedata = [];
    if (dates) {
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      data.forEach(item => {
        if (item.posttime >= dateStrings[0] && item.posttime <= dateStrings[1]) {
          datedata.push(item);
        }
      });
      setTableData(datedata);
    } else {
      setTableData(data);
      console.log('Clear');
    }
  };
  const rangePresets = [
    {
      label: 'Last 7 Days',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: 'Last 14 Days',
      value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
      label: 'Last 30 Days',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: 'Last 90 Days',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ];

  //ifflagged
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    const flagdata = [];
    if (e.target.checked) {
      data.forEach(item => {
        if (item.flagged.includes(localStorage.getItem('uid'))) {
          flagdata.push(item);
        }
      });
      setTableData(flagdata);
    }else{
      setTableData(data);
    }
  };

  //tablefilter
  const onChangeFilter = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const SectionName = localStorage.getItem('cname') + " —— Forum";

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
            <div className="Forum-Content">
              <div className="Forum-Filter">
                <Link to="/coursemainpage/createforum">
                  <Button type="primary" htmlType="submit" size="large" style={{ width: 160, marginRight: 50 }}>Create a Post</Button>
                </Link>
                <RangePicker presets={rangePresets} onChange={onRangeChange} style={{ width: 400, height: 35, marginRight: 50 }} />
                <Checkbox onChange={onChange} className="Forum-Checkbox">flagged</Checkbox>
              </div>
              <div className="Forum-List">
                <Table
                  // The rowkey is to tell which property of data would be the key of the row
                  rowKey={"postid"}
                  columns={columns}
                  dataSource={tabledata.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                  onChange={onChangeFilter}
                  pagination={paginationConfig}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        fetch_post_data(record.postid, record.creatorid)
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
export default Forum;