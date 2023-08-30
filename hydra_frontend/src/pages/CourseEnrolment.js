import { Table, Checkbox, Input, Button, message } from 'antd';
import { useState, useEffect} from 'react';
import {useNavigate } from 'react-router-dom';

const uid = localStorage.getItem('uid');

const CourseEnrolment = () => {
    const navigate = useNavigate();
    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'coursename',
            key: 'coursename',
            sorter: (a, b) => a.coursename.localeCompare(b.coursename),
            render: (text, record) => (
                <div onClick={() => handleSelect(record.coursename)}>
                    {record.selected ? <Checkbox checked /> : <Checkbox />}
                    {'\n'+text}
                </div>
            ),
        },
        {
        title: 'Lecturer',
        dataIndex: 'creatorname',
        key: 'creatorname',
        sorter: (a, b) => a.creatorname - b.creatorname,
        },
        {
        title: 'Course Description',
        dataIndex: 'coursedescription',
        key: 'coursedescription',
        },
    ];
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSearch = (value) => {
        const filteredData = data.filter((record) => {
        return record.coursename.toLowerCase().includes(value.toLowerCase());
        });
        setFilteredData(filteredData);
    };

    const handleSelect = (key) => {
        const index = selectedRows.indexOf(key);
        if (index === -1) {
        setSelectedRows([...selectedRows, key]);
        } else {
        setSelectedRows(selectedRows.filter((item) => item !== key));
        }
    };

    const handleSubmit = () => {
        console.log('selected rows', selectedRows);
        let request;
        if (selectedRows.length === 0) {
            message.error('Please select at least one course!');
        }
        else if (selectedRows.length === 1) {
            request = {coursename: selectedRows[0], uid: uid};
            fetch(`http://localhost:8000/enrollcourses/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                }).then(async(response) => {
                    const jsonRes = await response.json();
                    console.log('response is', jsonRes);
                    if (jsonRes.status !== 200) {
                        message.error(jsonRes.error);
                        return;
                    }
                    else {
                        message.success('Successful!');
                        navigate('/dashboard');
                    }

                    
                })
        }
        else {
            message.error('You can only select one course once!');
            setTimeout(() => {
                window.location.reload();
             }, 1500);
        }
        
    };
    const fetchCourses = () => {
        fetch(`http://localhost:8000/courses/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify({'uid': uid}),
            }).then(async(response) => {
                const jsonRes = await response.json();
                if (jsonRes.status !== 200) {
                    message.error(jsonRes.error);
                    return;
                }
                message.success('Successful!');
                setData(jsonRes.courses);
                setFilteredData(jsonRes.courses);
                
            })
    };
    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <>
            <Input.Search placeholder="Search" onSearch={handleSearch} />
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <Button type='primary' onClick={handleSubmit}>Submit</Button>
            </div>
        </>
    );
};

export default CourseEnrolment;
