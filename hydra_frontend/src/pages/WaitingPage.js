import { Result, Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import pic from '../img/hydra1.png';

const Waiting = () => (
  <Result
    icon={<img src={pic} style={{maxWidth: '350px'}}/>}
    title="Great, we have sent you an email! Please click the link in your email to reset your password."
    extra={
        <Link to="/"> 
            <Button type="primary" style={{marginTop: '50px'}}>Back to Log In</Button>
        </Link>
    }
  />
);

export default Waiting;