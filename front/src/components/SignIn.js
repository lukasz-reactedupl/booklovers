import React, {useState} from 'react';
import PropTypes from 'prop-types';
import logo from '../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link  } from "react-router-dom";
import {submitItem, showNote} from '../functions';
import useAuth from "../hooks/useAuth";

export default function SignIn({setData}) {
  const { setAuth } = useAuth(); //gives undefined for setAuth because returns empty object
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  
  const handleSubmit = async e => {
    e.preventDefault();
    //console.log(username);
    //console.log(password);
    const response = await submitItem({
      username,
      password
    }, 'signin');
    //console.log(response);
    //console.log({...response, plainTextPassword: password});
    //console.log(password);
    if(response.status=="valid-user") {
      //setAuth({ ...response, plainTextPassword: password, roles: ["valid-user"] });
      setData((prev) => ({...prev, ...response, plainTextPassword: password}));
      navigate("/myprofile");
    } else if(response.status==="invalid-password") {
      showNote(document.getElementById("password-div"), "bottom-out", "Invalid password");
      return;
    }
    else {
      showNote(document.getElementById("signin-login"), "bottom-out", "No such user");
      return;
      //navigate("/signin");
    }}
  return(
    <div>
        <div className='page-container'>
          <div id="signin-form" className='form'>
          <div className='logo-container'>
            <img className="logo-img" src={logo} alt="logo" />
            <h1 className='logo-h1'>BookLovers</h1>
          </div>
          <form id="form-signin" onSubmit={handleSubmit} >
            <input onChange={e => setUserName(e.target.value)} className='big-input' id="signin-login" type="text" placeholder='Enter login' required/>
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
            <input type="submit" id="signin-button" className="button" value="Sign in" />
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