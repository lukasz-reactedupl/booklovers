import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress,  faClose } from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import { genres } from '../../constants';
import Item from "../Item";
import Header from '../Header';
import {submitItem, inputChecked, expanderClick, showNote} from '../../functions';
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function NewTopForm({ username, setData, top }) {
    const oldTitle = top ? top.title : null;
    const [expanded, setExpanded] = useState(true);
    const [title, setTitle] = useState(top ? top.title : null);
    const [currentGenres, setCurrentGenres] = useState([]);
    const [books, setBooks] = useState(top ? top.books : []);
    const navigate = useNavigate();

    const removeBook = (e) => {
        e.preventDefault();
        setBooks(books.filter(book => book.title !== e.target.closest('button').value));
        console.log(books);
    }
    const addBook = (e) => {
        [...document.querySelectorAll('#new-book-form > fieldset > input:not(#add-book)')].map(input => input.required = true);
        e.preventDefault();
        if (!document.getElementById("book-title").value) {
            showNote(document.getElementById("book-title"), "bottom-out", "Title is required");
            return;
        };
        if (!document.getElementById("book-author").value) {
            showNote(document.getElementById("book-author"), "bottom-out", "Author is required");
            return;
        };
        if (!currentGenres.length) {
            showNote(document.getElementById("book-genres"), "bottom-out", "At least 1 genre is required");
            return;
        };
        let book = {
            title: document.getElementById("book-title").value,
            author: document.getElementById("book-author").value,
            genres: currentGenres.join(',')
        };

        //console.log(book);
        setBooks(books => [...books, book]);
        document.getElementById("book-title").value = "";
        document.getElementById("book-author").value = "";
        [...document.querySelectorAll('input[type=checkbox]:checked')].map(checkbox => checkbox.checked = false);
        [...document.querySelectorAll('#new-book-form > fieldset > input:not(#add-book)')].map(input => input.required = false);
        setCurrentGenres([]);
        console.log(books);
    }
    const handleSubmit = async e => {
        e.preventDefault();
        if (books.length === 0) { alert('you need to have at least 1 book'); return; }
        let genre = document.querySelector('input[name="genre"]:checked').value;
        const response = !oldTitle ? await submitItem({
            username,
            title,
            genre,
            books,
        }, 'newtop') : await submitItem({
            username,
            title,
            genre,
            books,
            oldTitle
        }, 'edittop');
        console.log(response);
        if (response.status === "top-added") {
            document.getElementById("top-title").value = "";
            setBooks([]);
            document.querySelector('input:checked').checked = false;
            setData((prev) => ({ ...prev, edit: response }));
        } else if (response.status === "top-edited") {
            setData((prev) => ({ ...prev, edit: null }));
            navigate(`/${username}-tops`);
        } else if (response.status === "title-taken") {
            showNote(document.getElementById("top-title"), "bottom-out", "You already have top with this title");
            return;
        }
    }
    const topStyle = top && { width: "60%", margin: "5rem auto" };
    return (
        <div>
            {top && <Header />}
            <div style={topStyle} className="form-container">
                <button className="form-expander" onClick={e => { expanderClick(expanded, setExpanded, "top-form") }}>
                    <FontAwesomeIcon icon={expanded ? faCompress : faExpand} />
                </button>
                <h2 className="form-header">{top ? "Edit" : "New"} top</h2>
                <form onSubmit={handleSubmit} id="top-form" className="new-item-form">
                    <label className='form-label' id="title-label">Title</label>
                    <input defaultValue={top ? top.title : ""} onChange={e => setTitle(e.target.value)} id="top-title" 
                        type="text" placeholder="Enter top title" required />
                    <label className='form-label'>Genre</label>
                    <div className='form-genres'>
                        <div>
                            {genres.slice(0, Math.ceil((genres.length + 1) / 2)).map(genre => (
                            <label key={"top-" + genre}>
                                <input defaultChecked={top ? top.genre === genre : false} value={genre} type="radio" name="genre" />
                                 {genre}
                            </label>))}
                        </div>
                        <div>
                            {[...genres, "different"].slice(Math.ceil((genres.length + 1) / 2), genres.length + 1).map(genre => (
                            <label key={"top-" + genre}>
                                <input defaultChecked={top ? top.genre === genre : false} key={genre} value={genre} type="radio" name="genre" />
                                 {genre}
                            </label>))}
                        </div>
                    </div>
                    <label className='form-label' id="books-label">Books</label>
                    <div className="books">{books.map(book => (
                        <div className="flex-center" key={book.title}>
                            <Item item={book} setData={setData} />
                            <button value={book.title} onClick={removeBook} className="remove-book">
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>))}
                    </div>
                    <div id="new-book-form">
                        <fieldset>
                            <legend>Add new book</legend>
                            <label className='form-label' id="title-label">Title</label>
                            <input id="book-title" type="text" placeholder="Enter book title" />
                            <label className='form-label' id="author-label">Author</label>
                            <input id="book-author" type="text" placeholder="Enter book author" />
                            <label className='form-label' id="book-genres">Genres:</label>
                            <div className='form-genres'>
                                <div>
                                    {genres.slice(0, Math.ceil(genres.length / 2)).map(genre => (
                                    <label key={"book-" + genre}>
                                        <input onClick={e => inputChecked(e, currentGenres, setCurrentGenres)} value={genre} type="checkbox" />
                                         {genre}
                                    </label>))}
                                </div>
                                <div>
                                    {genres.slice(Math.ceil(genres.length / 2), genres.length).map(genre => (
                                    <label key={"book-" + genre}>
                                        <input onClick={e => inputChecked(e, currentGenres, setCurrentGenres)} value={genre} type="checkbox" />
                                         {genre}
                                    </label>))}
                                </div>
                            </div>
                            <button onClick={addBook} id='add-book' type="submit">Add new book</button>
                        </fieldset></div>
                    {!top && <input className='button form-submit' type="submit" value='Add new top' />}
                    {top && <div className="save-submit">
                        <input className='button save-changes' type="submit" value={'Save changes'} />
                        <Link to={`/${username}-tops`}>
                            <button className='button cancel-button'>Cancel</button>
                        </Link>
                    </div>}
                </form>
            </div>
        </div>
    );
}

NewTopForm.propTypes = {
    username: PropTypes.string.isRequired,
    setData: PropTypes.func.isRequired,
  };