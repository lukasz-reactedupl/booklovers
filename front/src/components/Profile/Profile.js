import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { avatarSources } from '../../constants';

export default function Profile({ user, rang }) {
    return (
      <div className="Profile">
        <img className="Profile-avatar" src={avatarSources[user.avatar]} alt="avatar" />
        <div className="Profile-user">
          <p className="Profile-name">{user.name}</p>
          <p className="Profile-surname">{user.surname}</p>
          <p className="Profile-rang">{rang}</p>
        </div>
        <div>
            <p className="Profile-p-genres">Genres:</p> 
            {user.genresString.split(',').map(genre => (<p key={genre} className='Profile-genre'>{genre}</p>))}
        </div>
        <div>
            <p className="Profile-p-genres">About me:</p>
            <p className="Profile-text">{user.about}</p>
        </div>
        <Link to="/edit">
            <button id="edit-profile" className="button">Edit <FontAwesomeIcon icon={faEdit} />
            </button>
        </Link>
      </div>
    );
  }