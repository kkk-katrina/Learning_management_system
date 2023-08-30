import './App.css';
import * as React from 'react'
import ResetPassword1 from './pages/ResetPassword1';
import ResetPassword2 from './pages/ResetPassword2';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import EditAvatar from './pages/EditAvatar';
import CourseHistory from './pages/CourseHistory';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Registrationpage from './pages/Registrationpage';
import Dashboard from './pages/Dashboard';
import DashboardLecturer from './pages/DashboardLecturer';
import CourseEnrolment from './pages/CourseEnrolment';
import Forum from "./pages/Forum";
import CreateForum from './pages/CreateForum';
import EditForum from './pages/EditForum';
import ForumDetailStudent from './pages/ForumDetail-student';

import Coursemainpage from "./pages/Coursemainpage";
import Quiz from "./pages/Quiz";
import Assignment from "./pages/Assignment";
import AnnouncementLecturer from "./pages/AnnouncementLecturer";
import Grade from './pages/Grade';

// Material page for lecturer.
import Material from "./pages/Material";
import VideoPlayer from './pages/VedioPlayer';

//Online Lecture page
import OnlineLecture from './pages/OnlineLecture';

import Waiting from './pages/WaitingPage';

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Loginpage/>}/>
                <Route path="/register" element={<Registrationpage/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/dashboardlecturer" element={<DashboardLecturer/>}/>
                <Route path="/dashboard/enrolment" element={<CourseEnrolment/>}/>
                <Route path="/coursemainpage" element={<Coursemainpage/>}/>
                <Route path="/editprofile" element={<EditProfile/>}/>
                <Route path="/enrolmenthistory" element={<CourseHistory/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/editavatar" element={<EditAvatar/>}/>
                <Route path="/resetpassword/1" element={<ResetPassword1/>}/>
                <Route path="/resetpassword/2" element={<ResetPassword2/>}/>
                <Route path="/coursemainpage/forum" element={<Forum/>}/>
                <Route path="/coursemainpage/createforum" element={<CreateForum/>}/>
                <Route path="/coursemainpage/editforum/:pid" element={<EditForum/>}/>
                <Route path="/coursemainpage/forum/:pid" element={<ForumDetailStudent/>}/>
                <Route path="/coursemainpage/quiz" element={<Quiz/>}/>
                <Route path="/coursemainpage/assignment" element={<Assignment/>}/>
                <Route path="/coursemainpage/announcementsLecturer" element={<AnnouncementLecturer/>}/>
                <Route path="/Coursemainpage/grade" element={<Grade/>}/>
                <Route path="/coursemainpage/material" element={<Material/>}/>
                <Route path="/coursemainpage/videoPlayer" element={<VideoPlayer/>}/>
                <Route path="/coursemainpage/onlinelecture" element={<OnlineLecture/>}/>
                <Route path="/waiting" element={<Waiting/>}/>
            </Routes>
        </>
    );
}

export default App;