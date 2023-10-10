import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import logo from '../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link  } from "react-router-dom";
import {submitItem, showNote} from '../functions';
import AuthContext from '../context/AuthProvider';

export default function SignIn({setData}) {
  //LM: Removed line below, we don't need that anymore
  //const { setAuth } = useAuth(); //gives undefined for setAuth because returns empty object
  const navigate = useNavigate();
  
  //LM: Commented out line below, this now comes from the context
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  //LM: Reaching out to the context
  const {usrName, setUsrName} = useContext(AuthContext);
  
  //LM: temporarily removed handleSubmit to make room for a simple check if we can save data in context
  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   //console.log(username);
  //   //console.log(password);
  //   const response = await submitItem({
  //     username,
  //     password
  //   }, 'signin');
  //   //console.log(response);
  //   //console.log({...response, plainTextPassword: password});
  //   //console.log(password);
  //   if(response.status=="valid-user") {
  //     //setAuth({ ...response, plainTextPassword: password, roles: ["valid-user"] });
  //     setData((prev) => ({...prev, ...response, plainTextPassword: password}));
  //     navigate("/myprofile");
  //   } else if(response.status==="invalid-password") {
  //     showNote(document.getElementById("password-div"), "bottom-out", "Invalid password");
  //     return;
  //   }
  //   else {
  //     showNote(document.getElementById("signin-login"), "bottom-out", "No such user");
  //     return;
  //     //navigate("/signin");
  //   }}

  //LM: added handler
  const handleSignIn = (e, userName, password) => {
    e.preventDefault();
    setUsrName(userName); //LM: This is where we set the value in the state
  }


  return(
    <div>
        <div className='page-container'>
          <div id="signin-form" className='form'>
          <div className='logo-container'>
            <img className="logo-img" src={logo} alt="logo" />
            <h1 className='logo-h1'>BookLovers</h1>
          </div>
          <form id="form-signin" onSubmit={() => console.log('Tmp replacement of hande submit')} >
            <input onChange={e => setUsername(e.target.value)} className='big-input' id="signin-login" type="text" placeholder='Enter login' required/>
            <div id="password-div" className='big-input'>
              <input 
                    onFocus={e => {
                      e.target.closest('div').style.outline = "none";
                      e.target.closest('div').style.border = "2px solid #613A43"}}

                    onBlur={e => {
                      e.target.closest('div').style.outline = "none"; 
                      e.target.closest('div').style.border = "1px solid #613A43"}}

                    onChange={e => setPassword(e.target.value)} 
                    
                    className='password-input' id="signin-password" type="password" placeholder='Enter password' required/>

              <FontAwesomeIcon onClick={e => {
                document.getElementById('signin-password').type="text"; 
                setTimeout(() => {
                  if(document.getElementById('signin-password')) 
                    document.getElementById('signin-password').type="password";
                  }, 3000);}} 
                  
                className="eye-icon" icon={faEyeSlash} />
            </div>
            {/* <input type="submit" id="signin-button" className="button" value="Sign in" /> */}
            {/* LM: replaved input with a button to be able to directly define handler */}
            <button onClick={(e) => handleSignIn(e, username, password)}>Sign in</button>
            <Link to="/register" id="register-link">No account yet? Register!</Link>
          </form>
          </div>
        </div>
        </div>
  )
}

/**/
SignIn.propTypes = {
  setData: PropTypes.func.isRequired
};