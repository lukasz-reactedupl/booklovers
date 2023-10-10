import React from 'react';
import { rangs } from '../constants';
import PropTypes from 'prop-types';
import Header from './Header';
import Profile from './Profile/Profile';
import Board from './Profile/Board';
import NewReviewForm from './Profile/NewReviewForm';
import NewTopForm from './Profile/NewTopForm';
import NewQuoteForm from './Profile/NewQuoteForm';

function autoResize() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
}

export default function ProfilePage({ setData, user, quotes, tops, reviews, data }) {
  let username = user.username;
  let rang;
  switch (true) {
    case (quotes.length >= tops.length && quotes.length >= reviews.length):
      rang = rangs[0];
      break;
    case (quotes.length === tops.length && quotes.length === reviews.length && quotes.length > 3):
      rang = rangs[1];
      break;
    case (reviews.length >= tops.length && reviews.length >= quotes.length):
      rang = rangs[2];
      break;
    case (quotes.length === 0 && tops.length === 0 && reviews.length === 0):
      rang = rangs[3];
      break;
    case (tops.length >= reviews.length && tops.length >= quotes.length):
      rang = rangs[4];
      break;
    default:
      rang = rangs[3];
      break;

  }
  [...document.querySelectorAll("textarea")].map(textarea => textarea.addEventListener('input', autoResize, false));
  return (
    <div>
      <Header />
      <div id='ProfilePage'>
        <div id="left-column">
          <Profile rang={rang} setData={setData} user={user} />
          <Board setData={setData} username={username} content="My tops" items={tops.length > 3 ? tops.slice(0, 3) : tops} />
        </div>
        <div id='middle-column'>
          <NewReviewForm username={username} setData={setData} />
          <NewTopForm username={username} setData={setData} />
          <NewQuoteForm username={username} setData={setData} />
        </div>
        <div id='right-column'>
          <Board setData={setData} username={username} content="My reviews" items={reviews.length > 3 ? reviews.slice(0, 3) : reviews} />
          <Board setData={setData} username={username} content="My quotes" items={quotes.length > 3 ? quotes.slice(0, 3) : quotes} />
        </div>
      </div>
    </div>
  );
}

ProfilePage.propTypes = {
  setData: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};