import React, { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Overview from "../pages/overview";
import Users from "../pages/users";
import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContextProvider";
import Settings from "../pages/settings";

// For Auth
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import School from "../pages/school";
import Career from "../pages/careers"
import University from "../pages/university"
import Skills from "../pages/skills"
import StudentBlog from "../pages/studentBlog"
import StudentExperience from "../pages/studentExperience";

const RouteApps = () => {
  const { isLoggedIn } = useContext(AppContext);
  const userString = localStorage.getItem("admin-user");
  const user = JSON.parse(userString);
  const role = user?.role;

  return (
    <>
      {isLoggedIn ? (
        <>
          {/* <Navbar /> */}
          <div className='grid-container'>
            <div className='grid-child'>
              <Sidebar role={role} />
            </div>

            <div className='grid-child'>
              <Routes>
                <Route
                  path='*'
                  element={<Navigate to='/users' replace />}
                />
                {/* <Route path='/dashboard' element={<Overview />} /> */}
        
                <Route path='/schools' element={<School />} />
                {/* <Route
                  path='/clients-info/:clientId'
                  element={<ClientInfo />}
                /> */}
                <Route path='/users' element={<Users />} />

                <Route path="/careers" element={<Career />} />
                <Route path="/university" element={<University />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/studentBlog" element={<StudentBlog />} />
                <Route path="/student-experience" element={<StudentExperience />} />
            
                <Route path='/settings'>
                  <Route index element={<Navigate to='general' replace />} />
                  <Route path=':source' element={<Settings />} />
                </Route>
                
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='*' element={<Navigate to='/' replace />} />
          <Route path='/login/forgot-password' element={<ForgotPassword />} />
          <Route path='/api/users/auth/passwordReset' element={<ResetPassword />} />    
        </Routes>
      )}
    </>
  );
};

export default RouteApps;
