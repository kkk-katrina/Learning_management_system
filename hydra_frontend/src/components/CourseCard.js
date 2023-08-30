import { Card, message, Dropdown, Menu} from 'antd';
import {
  DownOutlined
} from '@ant-design/icons';
import { useState, useEffect} from 'react';
import {useNavigate } from 'react-router-dom';
import pic from '../img/unsw.jpeg';
import '../styles/CourseCard.css';

const { Meta } = Card;

const ShowCourse = ({uid, role}) => {
  let fetchUrl;
  let path;
  let choice;
  if (role === 'lecturer') {
    fetchUrl = 'createdcourses';
    path = 'deletecourses';
    choice = 'Delete course';

  }
  else if (role === 'student'){
    fetchUrl = 'enrolledcourses';
    path = 'dropcourses';
    choice = 'Drop course';
  }
  
  const navigate = useNavigate();
  const [courseList, setCourseList] = useState([]);
  const handleNavigate = (id, cname, cdes) => {
    localStorage.setItem('cid', id);
    localStorage.setItem('cname', cname);
    localStorage.setItem('cdes', cdes);
    console.log(localStorage.getItem('cdes'));
    navigate('/coursemainpage');
  };
  
  
  const getCourses = () => {
    fetch(`http://localhost:8000/${fetchUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'uid': uid}),
    }).then(async(response) => {
        const jsonRes = await response.json();
        if (response.status !== 200) {
            message.error(jsonRes.error);
            return;
        }
   
        setCourseList(jsonRes.courses);
     
    })
  };
  useEffect(() => {
    getCourses();
  }, []);

  const dropCourse =(cid) => {
    fetch(`http://localhost:8000/${path}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({'uid': uid, 'cid': cid}),
    }).then(async(response) => {
      const jsonRes = await response.json();
      if (response.status !== 200) {
          message.error(jsonRes.error);
          return;
      }
      getCourses();
      message.success('Successful!');
    })};

  return (
    <div className='coursecard'>
      {courseList.map(courses => (
        <Card
          hoverable
          className='cards'
          cover={<img
            alt="course"
            src={pic} />}
          style={{ position: "relative" }}
          actions={[
            <Dropdown
              overlay={<Menu onClick={() => dropCourse(courses.cid)}>
                <Menu.Item key="1">{choice}</Menu.Item>
              </Menu>}
              style={{ border: "none", position: "absolute", bottom: 0, right: 0 }}
            >
              <DownOutlined style={{ fontSize: 16 }} onClick={() => { } } />
            </Dropdown>
          ]}
        >
          <Meta
            className='card-meta'
            title={courses.coursename}
            description={<p className="custom-card-description">{courses.coursedescription}</p>} />
          <div onClick={() => handleNavigate(courses.cid, courses.coursename, courses.coursedescription)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></div>
        </Card>
    
      
      
      
      
      ))}
    </div>
  );
};

export default ShowCourse;
