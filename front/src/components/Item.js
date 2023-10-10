import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEdit, faUser, faBook, faPenNib, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import {React, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getItemType } from '../functions';


function SwitchComponentCompressed({itemType, item}) {
  console.log(itemType);
  switch (itemType) {
    case "review":
      return (
        <>
          <h2 className="item-header">{item.title}</h2>
          <p className='item-authors'>{`- ${item.author}`}</p> {/*style={{textAlign: expand ? "left" : "right"}}*/}
          <span>{
            Array.apply(null, { length: item.rank }).map((e, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className='gold-star' />
            ))
            }</span>
            <span>{
            Array.apply(null, { length: 5-item.rank }).map((e, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className='gray-star' />
            ))
            }</span>
            <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>
        </>
      );
    case "top":
      return (
        <>
          <h2 className="item-header">{item.title}</h2>
          <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>

        </>
      );
    case "quote":
      return (
        <>
          <p className='item-text'>{item.quoteText}</p>
          <p className='item-authors'>{`- ${item.author}`}</p> {/*style={{textAlign: expand ? "left" : "right"}}*/}
          <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>

        </>
      );
    case "user":
      return (
        <p className='item-authors'><FontAwesomeIcon icon={faUser} /> {item.username}</p>
      );
    case "title":
      return (
        <h2 className="item-header">{item.title}</h2>
      );
    case "book":
      return (
        <>
          <h3 className='item-header'><FontAwesomeIcon icon={faBook} /> {item.title}</h3>
          <p className='item-authors'><FontAwesomeIcon icon={faPenNib} /> {item.author}</p>
          <p className='item-authors'>Genres: {item.genres.split(',').join(', ')}</p>
        </>
      );
    default:
      return null;
  }
}

function SwitchComponentExpanded({itemType, item, setData}) {
  switch(itemType) {
    case "review":
      return(
        <>
            <p className="Profile-p-genres">Genres:</p> 
            {item.genresString.split(',').map(genre => (<p key={genre} className='Profile-genre'>{genre}</p>))}
            <p className="Profile-p-genres">Review:</p>
            <p className='Profile-text'>{item.reviewText}</p>
        </>
      );
    case "top":
      return(
        <>
        <p className='form-label'>Genre: {item.genre}</p>
        <div className="books">
          {item.books.map(book => (<Item key={book.title} item={book} setData={setData}/>))}
        </div>
        </>
      );
      default:
        return null;
  }
}

function Buttons({itemType, item, expanded, setExpanded, setData, editable, expand}) {
  if(editable && expand) {
    switch(itemType) {
      case "quote":
        return(
          <div className="quote-body">
            <Link to={"/edit" + itemType}>
              <button onClick={e => {setData((prev)=>({...prev, edit: item}))}} className="edit-item-button">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </Link>
          </div>
        );
      case "top":
      case "review":
        return(
          <div className="top-review-body">
            <button onClick={e => {setExpanded(!expanded)}} className="Board-expander">
              <FontAwesomeIcon icon={faAngleDown} flip={expanded ? "vertical" : false}  />
            </button>
            <Link to={"/edit" + itemType}>
              <button onClick={e => {setData((prev)=>({...prev, edit: item}))}} className="edit-item-button">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </Link>
          </div>
        );
      default: 
        return null;
    }
  } else if (!editable && expand) {
    switch(itemType) {
      case "top":
      case "review":
        return (
        <button onClick={e => {setExpanded(!expanded)}} className="Board-expander">
          <FontAwesomeIcon icon={faAngleDown} flip={expanded ? "vertical" : false} />
        </button>
        );
      default: 
        return null;
    }
  } else {
    return null;
  }
}

function Item({item, editable, setData, expand}) {
  // If you have a complex logic don't use ? : 
  // Why not to create a function which iterates over keys or smth? 
  const itemType = getItemType(item);

  const [expanded, setExpanded] = useState();

      return (
        <div className="item">
          <div className='item-body'>
            <SwitchComponentCompressed itemType={itemType} item={item} />
            {expanded && <SwitchComponentExpanded itemType={itemType} item={item} setData={setData} />}
          </div>
            <Buttons itemType={itemType} item={item} expanded={expanded} setExpanded={setExpanded} setData={setData} editable={editable} expand={expand} />
          </div>
      );
    }
  
    Item.propTypes = {
      item: PropTypes.object.isRequired,
    };

  export default Item;