import React from 'react';
import { useLocation } from 'react-router-dom';

const VideoPlayer = (props) => {
    const {state} = useLocation();
    console.log(state);
    return (
        <div style={{height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <video controls style={{height: '100vh'}}>
            <source src={state.filepath} type="video/mp4" />
        </video>
        </div>
    );
};

export default VideoPlayer;
