import React, { useState, useEffect } from 'react';
import { List, Avatar } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const Robot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
   
    setMessages([
      {
        author: 'Robot',
        content: 'Hello, I am a robot. How can I assist you?',
      },
    ]);
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<RobotOutlined />} />
            }
            title={item.author}
            description={item.content}
          />
        </List.Item>
      )}
    />
  );
};
export default Robot;