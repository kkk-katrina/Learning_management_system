import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Tooltip, message, Card } from 'antd';
import Navibar from '../components/Navibar';
import { Button, Modal, Space, Input, Radio, Checkbox } from 'antd';
import { RollbackOutlined, FundOutlined } from '@ant-design/icons';
import axios from 'axios';
import pic from '../img/hydra1.png';
import '../styles/Assignment.css';

export default function Quiz () {
    const { Header, Content, Footer, Sider } = Layout;
    const { TextArea } = Input;
    const { Meta } = Card;
    const role = localStorage.getItem('role');
    const cid = localStorage.getItem('cid');
    const SectionName = localStorage.getItem('cname') + " —— Quiz";

    const [open, setOpen] = useState(false);
    const openModal = (modalId) => {
        setCurrentModal(modalId);
        setOpen(true)
    };

    const closeModal = () => {
        setCurrentModal('');
        setOpen(false);
    };

    //Open different modal
    const [currentModal, setCurrentModal] = useState('');

    //Create Quiz Modal
    const [questionCount, setQuestionCount] = useState(1);
    const [questionData, setQuestionData] = useState([
        {
        question: '',
        type: 'single',
        options: [
            { label: 'A', value: 'a', input: '' },
            { label: 'B', value: 'b', input: '' },
            { label: 'C', value: 'c', input: '' },
            { label: 'D', value: 'd', input: '' },
        ],
        },
    ]);

    const quizData = [];
    questionData.forEach((question) => {
    const options = question.options.map((option) => {
        return { value: option.value, input: option.input };
        });
        quizData.push({
        description: question.question,
        options: options,
        answer: question.selectedOption,
        type: question.type,
        });
    });
 
    const ans = [];
    quizData.forEach((question) => {
      ans.push(question.answer);
    });

    const handleCreate = () => {
        setOpen(false);
        axios.post('http://localhost:8000/createquiz/', {
            cid: cid,
            ddl: '10',
            q1: quizData[0],
            q2: quizData[1],
            q3: quizData[2],
            ans: ans.join(' '),
        })
        .then(({ data }) => {
            if (data.status === 200) {
                message.success('Quiz created successfully');
            } else {
                message.error('Failed to create quiz');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error('Failed to create quiz');
        });
    };
    

    function handleQuestionChange(index, event) {
    const newQuestionData = [...questionData];
    newQuestionData[index].question = event.target.value;
    setQuestionData(newQuestionData);
    }

    function handleTypeChange(index, event) {
    const newQuestionData = [...questionData];
    newQuestionData[index].type = event.target.value;
    setQuestionData(newQuestionData);
    }

    function handleOptionChange(questionIndex, optionIndex, event) {
    const newQuestionData = [...questionData];
    newQuestionData[questionIndex].options[optionIndex].input = event.target.value;
    setQuestionData(newQuestionData);
    }

    const handleRadioChange = (index, value) => {
        const question = questionData[index];
        question.selectedOption = value;
        setQuestionData([...questionData.slice(0, index), question, ...questionData.slice(index + 1)]);
    };

    const handleCheckboxChange = (questionIndex, checkedValues) => {
    const newData = [...questionData];
    newData[questionIndex].selectedOption = checkedValues;
    setQuestionData(newData);
    };
      

    function handleAddQuestion() {
    setQuestionCount(questionCount + 1);
    const newQuestionData = [
        ...questionData,
        {
        question: '',
        type: 'single',
        options: [
            { label: 'A', value: 'a', input: '' },
            { label: 'B', value: 'b', input: '' },
            { label: 'C', value: 'c', input: '' },
            { label: 'D', value: 'd', input: '' },
        ],
        },
    ];
    setQuestionData(newQuestionData);
    }

    function handleRemoveQuestion(index) {
    setQuestionCount(questionCount - 1);
    const newQuestionData = [...questionData];
    newQuestionData.splice(index, 1);
    setQuestionData(newQuestionData);
    }


    //Show Quiz List
    const [quizList, setQuizList] = useState([]);
    useEffect(() => {
        axios.post('http://localhost:8000/quizlist/', {
            cid: cid
        })
        .then((response) => {
            setQuizList(response.data.quiz);
            localStorage.setItem('qid', response.data.quiz[0].qid);
        })
    }, []);

    //Show Quiz Detail
    const [quizDetail, setQuizDetail] = useState([]);
    const [questions, setQuestions] = useState([]);
    //Open Modal3 only once
    const [modal3Opened, setModal3Opened] = useState(false);

    const reviewQuiz = (modalId) => {
        axios.post('http://localhost:8000/reviewquiz/', {
            cid: cid,
            qid: localStorage.getItem('qid'),
            uid: localStorage.getItem('uid')
        })
        .then((response) => {
            setQuizDetail(response.data.quiz);
            console.log(response.data.quiz);
            if (modalId === 'modal2') {
            openModal('modal2');
            } else if (modalId === 'modal3') {
            openModal('modal3');
            setModal3Opened(true);
            }
        })
    };

    useEffect(() => {
        const computedQuestions = Object.keys(quizDetail)
            .filter((key) => key.startsWith("q"))
            .map((key) => quizDetail[key]);
            setQuestions(computedQuestions);
        }, [quizDetail]);

    //open modal & get quiz detail
    const openModalAndReview = (modalId) => {
        if (!modal3Opened) {
            setModal3Opened(true);
            reviewQuiz(modalId);
          }
    };
    

    //Submit Quiz for student
    const [stuQuestionData, setStuQuestionData] = useState([
        {
        question: '',
        type: 'single',
        options: [
            { label: 'A', value: 'a', input: '' },
            { label: 'B', value: 'b', input: '' },
            { label: 'C', value: 'c', input: '' },
            { label: 'D', value: 'd', input: '' },
        ],
        },
    ]);


    const stuRadioChange = (index, value) => {
        const newData = [...stuQuestionData];     
        if (!newData[index]) {
          newData[index] = {};
        }
      
        newData[index].selectedOption = value;
        setStuQuestionData(newData);
      };
      

    const stuCheckboxChange = (questionIndex, checkedValues) => {
        const newData = [...stuQuestionData];      
        if (!newData[questionIndex]) {
            newData[questionIndex] = {};
        }          
        newData[questionIndex].selectedOption = checkedValues;
        setStuQuestionData(newData);
        };
          
    const Ans = stuQuestionData.map((question) => {
        return question.selectedOption;
      });

    const stuAns = Ans.map(subAns => Array.isArray(subAns) ? subAns.join(' ') : subAns);


    const handleSubmit = () => {
        console.log(stuAns);
        axios.post('http://localhost:8000/attendquiz/', {
            cid: cid,
            qid: localStorage.getItem('qid'),
            uid: localStorage.getItem('uid'),
            ans: stuAns
        })
        .then((response) => {
            if (response.data.status === 200) {
                message.success('Quiz submitted successfully');
            } else {
                message.error('Failed to submit quiz');
            }
        })
    }

    //Quiz countdown
    const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
    useEffect(() => {
        let intervalId;
        if (open & currentModal === 'modal4') {
            intervalId = setInterval(() => {
                setCountdown(countdown => countdown - 1);
            }, 1000);
        }   
        return () => clearInterval(intervalId);
    }, [open, currentModal]);
    
    

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
                <Button type="primary" size = "large" onClick={() => openModal('modal1')} style={{marginLeft:'20px'}}>Create a new quiz</Button>
                <Modal
                    open={currentModal === 'modal1' && open}
                    id='modal1'
                    title="New quiz"
                    onOk={handleCreate}
                    onCancel={closeModal}
                    footer={[
                    <Button key="back" onClick={closeModal}> Cancel </Button>,
                    <Button key="create" type="primary" onClick={handleCreate} > Create </Button>
                    ]}
                >
                    Time Limit: <Input style={{width:'50px'}}></Input> mins
                    <h3 style={{color:'blue'}}>Select options to set correct answers.</h3>
                    {questionData.map((question, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                        <span>Q{index + 1}:</span>
                        <TextArea placeholder="Question" value={question.question} onChange={(e) => handleQuestionChange(index, e)} autoSize/>
                        <Radio.Group style={{ marginTop: '10px' }} value={question.type} onChange={(e) => handleTypeChange(index, e)}>
                            <Radio value="single">Single choice</Radio>
                            <Radio value="multiple">Multiple choice</Radio>
                        </Radio.Group>
                            {question.type === 'single' ? (
                                <Radio.Group 
                                    style={{ marginTop: '10px' }} 
                                    value={questionData[index].selectedOption}
                                    onChange={(e) => handleRadioChange(index, e.target.value)}>
                                {question.options.map((option, optionIndex) => (
                                    <Radio style={{marginTop:'10px'}} key={optionIndex} value={option.value}>
                                    {option.label}
                                    <TextArea
                                    autoSize
                                    style={{ marginLeft: '10px', width: '200px' }}
                                    placeholder={`Option ${option.label}`}
                                    value={option.input}
                                    onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                />
                                </Radio>
                            ))}
                        </Radio.Group>
                        ) : (
                            <Checkbox.Group 
                                value={questionData[index].selectedOption}
                                onChange={(checkedValues) => handleCheckboxChange(index, checkedValues)}
                                style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}} >
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} style={{ marginBottom: '10px' }}>
                                    <Checkbox style={{marginTop:'10px'}} value={option.value}>
                                    {option.label}
                                    <TextArea
                                        autoSize
                                        style={{ marginLeft: '10px', width: '200px' }}
                                        placeholder={`Option ${option.label}`}
                                        value={option.input}
                                        onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                    />
                                    </Checkbox>
                                </div>
                            ))}
                            </Checkbox.Group>
                        )}
                        {questionCount > 1 && (
                            <Button style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => handleRemoveQuestion(index)}>
                            Remove
                            </Button>
                        )}
                        </div>
                    ))}
                    <Button onClick={handleAddQuestion}>Add Question</Button>
                </Modal>
            </Space>

            <div class="container" style={{marginTop: "15px"}}> 
                {quizList.map((quiz, index) => (
                    <div key={quiz.qid} class="box">
                        <Card
                            hoverable
                            style={{
                            width: 300,
                            position: 'relative' 
                            }}
                            cover={
                            <img
                                alt="quiz"
                                src={pic}
                            />
                            }
                            onClick={reviewQuiz}
                        >
                            <Meta
                            title={`Quiz ${index+1}`}
                            />
                        </Card>
                        <Modal
                            open={currentModal === 'modal2'  && open}
                            id='modal2'
                            title={`Quiz ${index+1}`}
                            onCancel={closeModal}
                            footer={[
                            <Button key="back" onClick={closeModal}> Cancel </Button>
                            ]}>

                            {questions?.map((quiz, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                <h3>Q{index+1}: {quiz.description}</h3>
                                {quiz.type === 'single' ? (
                                    <Radio.Group value={quiz.answer}>
                                    {quiz.options.map((option, i) => (
                                        <Radio key={i} value={option.value}>
                                        {option.input}
                                        </Radio>
                                    ))}
                                    </Radio.Group>
                                ) : (
                                    <Checkbox.Group value={quiz.answer}>
                                    {quiz.options?.map((option, i) => (
                                        <Checkbox key={i} value={option.value}>
                                        {option.input}
                                        </Checkbox>
                                    ))}
                                    </Checkbox.Group>
                                )}
                                </div>
                            ))}                   
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
    } else { //role is student
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
            <div class="container" style={{marginTop: "15px"}}> 
                {quizList.map((quiz, index) => (
                    <div key={quiz.qid} class="box">
                        <Card
                            hoverable
                            style={{
                            width: 300,
                            position: 'relative' 
                            }}
                            cover={
                            <img
                                alt="quiz"
                                src={pic}
                            />
                            }
                            onClick={() => openModalAndReview('modal3')}
                        >
                        <Meta
                        title={`Quiz ${index+1}`}
                        />
                        </Card>
                        <Button onClick={() => openModalAndReview('modal3')} icon={<FundOutlined />} style={{marginTop:'10px'}}>Submit {`Quiz ${index+1}`} </Button>
                        <Modal
                        open={currentModal === 'modal3'  && open}
                        id='modal3'
                        title={`Quiz ${index+1}`}
                        onCancel={closeModal}
                        footer={[
                        <Button key="back" onClick={closeModal}> Cancel </Button>,
                        <Button key="notice" type="primary" onClick={() => openModal('modal4')} disabled={countdown < 0}> Yes </Button>,
                        ]}
                        >
                            Are you sure to start this quiz? There is a time limit in 10 minutes.
                        </Modal>

                        <Modal
                            open={currentModal === 'modal4'  && open}
                            id='modal4'
                            title={`Quiz ${index+1}`}
                            onCancel={closeModal}
                            footer={[
                            <Button key="back" onClick={closeModal}> Cancel </Button>,
                            <Button key="submit" type="primary" onClick={handleSubmit} disabled={countdown < 0}> Submit </Button>,
                            ]}>
                            <div>{Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}</div>

                            {questions.map((quiz, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                <h3>Q{index+1}: {quiz.description}</h3>
                                {quiz.type === 'single' ? (
                                    <Radio.Group 
                                    value={stuQuestionData[index]?.selectedOption}
                                    onChange={(e) => stuRadioChange(index, e.target.value)}>
                                    {quiz.options.map((option, i) => (
                                        <Radio key={i} value={option.value}>
                                        {option.input}
                                        </Radio>
                                    ))}
                                    </Radio.Group>
                                ) : (
                                    <Checkbox.Group
                                    value={stuQuestionData[index]?.selectedOption}
                                    onChange={(checkedValues) => stuCheckboxChange(index, checkedValues)}>
                                    {quiz.options.map((option, i) => (
                                        <Checkbox key={i} value={option.value}>
                                        {option.input}
                                        </Checkbox>
                                    ))}
                                    </Checkbox.Group>
                                )}
                                </div>
                            ))}
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

