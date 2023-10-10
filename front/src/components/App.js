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
import AuthContext from '../context/AuthProvider';
import '../styles/SignIn.css';
import '../styles/App.css'
import '../styles/Item.css'
import '../styles/Header.css'
import '../styles/Footer.css'
import '../styles/MainPage.css'
import '../styles/Profile.css'
import '../styles/Register.css'
import SampleComponentUsingContext from './SampleComponentUsingContext';

function App() {
  const [data, setData] = useState({}); //Create a wrapper component and use hooks for the keeping the user's info. Do not pass data to every copoment  
  //LM: Defined state to store the authentication details
  const [usrName, setUsrName] = useState();
  
  useEffect(() => {
    fetchData(data, setData);
  }, [data.edit]);

  return (
    // Wrapping entire App component in AuthContext
    <AuthContext.Provider value={{usrName, setUsrName}}>
      {/* LM: Added component here to ilustrate that now the context is being saved properly and can be consumed
          Note that SampleComponentUsingContext is now using value from the context */}
      <SampleComponentUsingContext /> 
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
      </Router>
    </AuthContext.Provider>);
}

export default App;
