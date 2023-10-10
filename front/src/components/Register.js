import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import logo from '../logo.png';
import { genres, avatars, passwordPattern, usernamePattern } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { submitItem, inputChecked, showNote } from '../functions';
import { Link, useNavigate } from "react-router-dom";

const styles = {
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? '2px solid #613A43' : '1px solid #073215',
    boxShadow: 'none',
    '&:hover': {
      border: state.isFocused ? '2px solid #613A43' : '1px solid #073215'
    }
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? isSelected ? '#88676e' : '#b29da2' : 'white'
  })
};

export default function Register({ setData, user, plainPassword }) {
  const oldUsername = user ? user.username : null;
  const initGenres = user ? user.genresString.split(',') : [];

  const [avatar, setAvatar] = useState(user ? user.avatar : null);
  const [username, setUserName] = useState(user ? user.username : null);
  const [password, setPassword] = useState(plainPassword ? plainPassword : null);
  const [name, setName] = useState(user ? user.name : null);
  const [surname, setSurname] = useState(user ? user.surname : null);
  const [userGenres, setUserGenres] = useState(initGenres);
  const [about, setAbout] = useState(user ? user.about : null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (userGenres.length === 0) { alert("choose at least one favourite genre"); return; }
    let genresString = [...userGenres].join(',');
    //console.log(genresString)
    //console.log(password);
    const response = user ? await submitItem({
      avatar,
      username,
      password,
      name,
      surname,
      genresString,
      about,
      oldUsername
    }, 'edit') : await submitItem({
      avatar,
      username,
      password,
      name,
      surname,
      genresString,
      about
    }, 'register');
    console.log(response);
    if (response.status === "edited-user" || response.status === "registered") {
      setData((prev) => ({ ...prev, user: response.user, plainTextPassword: password }));
      navigate("/myprofile");
    } else if (response.status === "usename-taken") {
      showNote(document.getElementById("login"), "bottom-out", "This username is taken");
      return;
    }
  }
 /*[...document.querySelectorAll("input[type=password]:not(#signin-password)")].map(input => input.addEventListener("invalid", function (e) {
    input.setCustomValidity('Password must contain at least 1 number, at least 1 uppercase and at least 1 lowercase letter');
  }));
   document.getElementById("login").addEventListener("invalid", function(e){
    this.setCustomValidity('Username has to be at least 4 characters long');
  });*/

  const registerButtonStyle = user ? 
    { width: "8rem", float: "left", margin: "0", paddingLeft: "10px" } : 
    { float: "left", margin: "0" };
    
  return (
    <div id="register-form">
      <div id="register-logo" className='logo-container'>
        <img className="logo-img" src={logo} alt="logo" />
        <h1 className='logo-h1'>BookLovers</h1>
      </div>
      <div className="form-container">
        <h2 className="form-header">My profile</h2>
        <form onSubmit={handleSubmit} id="review-form" className="new-item-form">
          <div id="register-avatar">
            <label className='form-label'>Choose your avatar</label>
            <div id="select-container">
              <Select defaultValue={user ? avatars.find(avatar => avatar.value === user.avatar) : ""} required id="select"
               onChange={e => setAvatar(e.value)} name="Choose your avatar" styles={styles}
              options={avatars} /> 
            </div>
          </div>
          <label className='form-label' id="login-label">Login</label>
          <input pattern={usernamePattern} onChange={e => setUserName(e.target.value)} id="login" type="text" 
            placeholder="Enter login" required defaultValue={user ? user.username : ""} />
          <label className='form-label' id="password-label">Password</label>
          <div id="div-password">
            <input 
              onFocus={e => { 
                e.target.closest('div').style.outline = "none"; 
                e.target.closest('div').style.border = "2px solid #613A43" }}

              onBlur={e => { 
                e.target.closest('div').style.outline = "none"; 
                e.target.closest('div').style.border = "1px solid #073215" }}

              onChange={e => {
                setPassword(e.target.value);
                //console.log(password)
              }}

              className='password-input' id="password-input" type="password" placeholder='Enter password' required 
              defaultValue={user ? plainPassword : ""} pattern={passwordPattern} /> {/**/}
            
            <FontAwesomeIcon onClick={e => {
              document.getElementById('password-input').type = "text"; 
              setTimeout(() => {
                if (document.getElementById('password-input')) 
                  document.getElementById('password-input').type = "password";
              }, 3000);}}
             className="eye-icon-grey" icon={faEyeSlash} />
          </div>

          <label className='form-label' id="name-label">Name</label>
          <input onChange={e => setName(e.target.value)} id="title" type="text" placeholder="Enter name" required defaultValue={user ? user.name : ""} />
          <label className='form-label' id="surname-label">Surname</label>
          <input onChange={e => setSurname(e.target.value)} id="author" type="text" placeholder="Enter surname" required defaultValue={user ? user.surname : ""} />
          <label className='form-label'>Favourite genre(s)</label>
          <div className='form-genres'>
            <div>
              {genres.slice(0, Math.ceil(genres.length / 2)).map(genre => (
                <label key={"register-" + genre}>
                  <input defaultChecked={user ? user.genresString.split(',').includes(genre) : false} 
                  onClick={e => inputChecked(e, userGenres, setUserGenres)} 
                  key={genre} value={genre} type="checkbox" />

                   {genre}
                </label>))}
            </div>
            <div>
              {genres.slice(Math.ceil(genres.length / 2), genres.length).map(genre => (
                <label key={"register-" + genre}>
                  <input defaultChecked={user ? user.genresString.split(',').includes(genre) : false} 
                  onClick={e => inputChecked(e, userGenres, setUserGenres)} 
                  key={genre} value={genre} type="checkbox" />
                  
                   {genre}
                </label>))}
            </div>
          </div>
          <label className='form-label' id="text-label">About me</label>
          <textarea onChange={e => setAbout(e.target.value)} placeholder="About me..." required defaultValue={user ? user.about : ""} />
          <div id="register-buttons">
            <input style={registerButtonStyle} id="register-button" className='button' type="submit" value={user ? 'Save changes' : 'Register'} />
            <Link to={user ? "/myprofile" : "/signin"}>
              <button className='button cancel-button'>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

Register.propTypes = {
  setData: PropTypes.func.isRequired
};
