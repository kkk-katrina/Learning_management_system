import { message} from 'antd';

export default function PostAnnouncement (route) {
    const uid = localStorage.getItem('uid');
    const cid = localStorage.getItem('cid');
    let path,request;
    if (route === 'material') {
        request = {uid: uid, 
            cid: cid,
            title: 'New teaching material', 
            content: 'Dear All, this is a reminder that your new teaching material is available, please check it out in the material page!'};
        path = 'materialannouncement';
    }
    else if (route === 'livelecture') {
        request = {uid: uid,
            cid: cid,
            title: 'Live lecture is open', 
            content: 'Dear All, this is a reminder that your live lecture is open, please go to the live lecture page to join!'};
        path = 'onlinecourseannouncement';
    }
    fetch(`http://localhost:8000/${path}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    body: JSON.stringify(request),
    }).then(async(response) => {
    const jsonRes = await response.json();
    console.log(jsonRes);
    if (response.status !== 200) {
        message.error(jsonRes.error);
        return;
    }
    message.success('Post announcement Successfully!');
    });



};
