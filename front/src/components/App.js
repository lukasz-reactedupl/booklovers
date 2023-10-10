import React, {useState, useEffect} from 'react';
import ProfilePage from './ProfilePage';
import Board from './Profile/Board';
import NewReviewForm from './Profile/NewReviewForm';
import NewTopForm from './Profile/NewTopForm';
import NewQuoteForm from './Profile/NewQuoteForm';
import MainPage from './MainPage';
import SignIn from './SignIn';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { fetchData } from '../functions';
import Footer from './Footer'; 
import RequireAuth from '../context/RequireAuth';
import '../styles/SignIn.css';
import '../styles/App.css'
import '../styles/Item.css'
import '../styles/Header.css'
import '../styles/Footer.css'
import '../styles/MainPage.css'
import '../styles/Profile.css'
import '../styles/Register.css'

function App() {
  const [data, setData] = useState({}); //Create a wrapper component and use hooks for the keeping the user's info. Do not pass data to every copoment  
  //Wrapper component https://www.digitalocean.com/community/tutorials/how-to-create-wrapper-components-in-react-with-props
  //Input hooks - https://www.youtube.com/watch?v=eQrbjvn_fSc (good series)
  useEffect(() => {
    fetchData(data, setData);
  }, [data.edit]);
//Source of the  project that uses same method: https://github.com/gitdagray/react_login_hooks/tree/main
//To create a wrapper Component which stores user's auth info you need to create a react context, a react hook, and a component itself. 
//Not just copy parse. More info:
//Context API - https://react.dev/learn/passing-data-deeply-with-context

//
//Place the code below in the folder context separated from the components (just fotr convinience) 
/* 
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

  export default AuthContext;
*/

//Then create a custom hook that will allow you to access auth data via useAuth(). Import in this file the AuthContext that you created before 
/* 
import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;
*/

/* Wrap the App in the index.js via AuthProvider that you created in context */
/* 
<React.StrictMode>
      <AuthProvider>
          <App />
      </AuthProvider>
  </React.StrictMode>,
*/

/* Create a component in which components that require auth will be placed */
// It is the example code. Your implementation on how exatly validate whether the use can access the component or nor may differ
/* 
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken //changed from user to accessToken to persist login after refresh
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/signin" state={{ from: location }} replace />
    );
}

export default RequireAuth;
*/

//Use nested routes to wrapp the components that require authed user 
/*
  <Route element={<RequireAuth />} />}>
      ...our routes 
  </Route>

*/


//Now to access user info in any component you can just call the hook useAuth, and get data from it. 
//Instead if setdata use setAuth without passing it every time 


  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/signin" element={<SignIn setData={setData} />} />
          <Route exact path="/"><Route index element={<Navigate to="/signin" replace />} /></Route>
          <Route exact path="/register" element={<Register setData={setData} />} />
          <Route exact path="/mainpage" element={<MainPage />} />
          {/*<Route element={<RequireAuth allowedRoles={["valid-user"]} />}>*/}
            {data && Object.keys(data).length &&
              <>
                <Route exact path="/myprofile" element={<ProfilePage data={data} user={data.user} quotes={data.quotes ? data.quotes : []} tops={data.tops ? data.tops : []} reviews={data.reviews ? data.reviews : []} setData={setData} />} />
                <Route exact path="/edit" element={<Register plainPassword={data.plainTextPassword} setData={setData} user={data.user} />} />
                <Route exact path={"/" + data.user.username + "-reviews"} element={<Board setData={setData} goback username={data.user.username} content="My reviews" items={data.reviews} />} />
                <Route exact path={"/" + data.user.username + "-tops"} element={<Board setData={setData} goback username={data.user.username} content="My tops" items={data.tops} />} />
                <Route exact path={"/" + data.user.username + "-quotes"} element={<Board setData={setData} goback username={data.user.username} content="My quotes" items={data.quotes} />} />
                <Route exact path={"/editreview"} element={<NewReviewForm username={data.user.username} review={data.edit} setData={setData} />} />
                <Route exact path={"/edittop"} element={<NewTopForm username={data.user.username} top={data.edit} setData={setData} />} />
                <Route exact path={"/editquote"} element={<NewQuoteForm username={data.user.username} quote={data.edit} setData={setData} />} />
              </>}
          {/*</Route>*/}
        </Routes>
        <Footer />
      </div>
    </Router>);
}

export default App;
