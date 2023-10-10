import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { genres } from '../../constants';
import Header from '../Header';
import { submitItem, inputChecked, expanderClick, showNote } from '../../functions';
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function NewReviewForm({ username, setData, review }) {
    const reviewTitle = review ? review.title : null;
    const initGenres = review && review.genresString ? review.genresString.split(',') : [];
    const [expanded, setExpanded] = useState(true);
    const [title, setTitle] = useState(review ? review.title : null);
    const [author, setAuthor] = useState(review ? review.author : null);
    const [rank, setRank] = useState(review ? review.rank : null);
    const [userGenres, setUserGenres] = useState(initGenres);
    const [reviewText, setReviewText] = useState(review ? review.reviewText : null);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        if (!userGenres) { alert("at least one genre is required"); return; }
        let genresString = [...userGenres].join(',');
        const response = !reviewTitle ? await submitItem({
            username,
            title,
            author,
            rank,
            genresString,
            reviewText,
        }, 'newreview') : await submitItem({
            username,
            title,
            author,
            rank,
            genresString,
            reviewText,
            reviewTitle
        }, 'editreview');
        console.log(response);
        if (response.status === "review-added") {
            document.getElementById("review-title").value = "";
            document.getElementById("review-author").value = "";
            document.getElementById("rank").value = "";
            document.getElementById("review-textarea").value = "";
            [...document.querySelectorAll('input[type=checkbox]:checked')].map(checkbox => checkbox.checked = false);
            setData((prev) => ({ ...prev, edit: response }));
            //setData((prev) => ({...prev, reviews: prev.reviews?[...prev.reviews, {username, title, author, rank, genresString, reviewText}]:[{username, title, author, rank, genresString, reviewText}]}));
        } else if (response.status === "review-edited") {
            setData((prev) => ({ ...prev, edit: null }));
            navigate(`/${username}-reviews`);
        } else if (response.status === "title-taken") {
            showNote(document.getElementById("review-title"), "bottom-out", "You already have review with this title");
            return;
        }
    }
    const reviewStyle = review && { width: "60%", margin: "5rem auto" };
    return (
        <div>
            {review && <Header />}
            <div style={reviewStyle} className="form-container">
                <button className="form-expander" onClick={e => { expanderClick(expanded, setExpanded, "review-form") }}>
                    <FontAwesomeIcon icon={expanded ? faCompress : faExpand} />
                </button>
                <h2 className="form-header">{review ? "Edit" : "New"} review</h2>
                <form onSubmit={handleSubmit} id="review-form" className="new-item-form">
                    <label className='form-label' id="title-label">Title</label>
                    <input defaultValue={review ? review.title : ""} onChange={e => setTitle(e.target.value)} id="review-title" 
                        type="text" placeholder="Enter book title" required />
                    <label className='form-label' id="author-label">Author</label>
                    <input defaultValue={review ? review.author : ""} onChange={e => setAuthor(e.target.value)} id="review-author"
                        type="text" placeholder="Enter book author" required />
                    <label className='form-label' id="rank-label">Rank</label>
                        <input defaultValue={review ? review.rank : ""} onChange={e => setRank(e.target.value)} min='1' max='5'
                             id="rank" type="number" placeholder="Rank" />
                    <label className='form-label'>Genre(s)</label>
                    <div className='form-genres'>
                        <div>
                            {genres.slice(0, Math.ceil(genres.length / 2)).map(genre => (
                            <label key={"review-" + genre}>
                                <input defaultChecked={review && review.genresString ? review.genresString.split(',').includes(genre) : false} 
                                onClick={e => inputChecked(e, userGenres, setUserGenres)} value={genre} type="checkbox" />
                                 {genre}
                            </label>))}
                        </div>
                        <div>
                            {genres.slice(Math.ceil(genres.length / 2), genres.length).map(genre => (
                            <label key={"review-" + genre}>
                                <input defaultChecked={review && review.genresString ? review.genresString.split(',').includes(genre) : false} 
                                onClick={e => inputChecked(e, userGenres, setUserGenres)} value={genre} type="checkbox" />
                                 {genre}
                            </label>))}
                        </div>
                    </div>
                    <label className='form-label' id="text-label">Review</label>
                    <textarea id="review-textarea" onChange={e => setReviewText(e.target.value)} placeholder="Your review..." required defaultValue={review ? review.reviewText : ""} />
                    {!review && <input className='button form-submit' type="submit" value='Add new review' />}
                    {review && 
                    <div className='save-submit'>
                        {/*<Link to={"/"+username+"-reviews"}>*/}
                        <input className='button save-changes' type="submit" value={'Save changes'} />
                        {/*</Link>*/}
                        <Link to={`/${username}-reviews`}>
                            <button className='button cancel-button'>Cancel</button>
                        </Link>
                    </div>}
                </form>
            </div>
        </div>
    );

}

NewReviewForm.propTypes = {
    username: PropTypes.string.isRequired,
    setData: PropTypes.func.isRequired,
  };