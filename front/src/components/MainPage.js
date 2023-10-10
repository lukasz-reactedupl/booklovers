import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import {React, useState} from 'react';
import Header from './Header';
import Item from './Item';
import { submitItem } from '../functions';

function MainPage() {
  const [items, setItems] = useState([]);
    function removeClick() {
      let input = document.getElementById("search-input");
      input.value="";
      setItems([]);
    }
    async function search(e) {
      if(e.key !== 'Enter') return;
      let request = e.target.value;
      if(request === "") return;
      let results = await submitItem({
        request
      }, 'search');
      console.log(results);
      if(results.status === "nothing-found") {
        setItems([{title: " no results"}]);
        //this.setState({items: [{title: " no results"}]});
      } else if(results.status === "successful-search") {
        //this.setState({items: results.items});
        setItems(results.items);
      }
    }
    let styleDisplay = {display: items.length ? "block" : "flex"};
      return(
        <div>
        <Header />
        <div id="search-container" style={styleDisplay} className='page-container'>
          <div className="big-input" id='search-bar'>
            <FontAwesomeIcon id="search-icon" icon={faSearch}/>
            <input onKeyDown={search} id="search-input" onDoubleClick={e => e.target.select()} type='text' placeholder='Search a review/top...' />
            <button onClick={removeClick} id="remove-button">
              <FontAwesomeIcon id="remove-icon" icon={faClose} />
            </button>
          </div>
          <div id="search-results">
            {items && items.map(item => (<Item expand key={item.quoteText?item.quoteText:item.title} item={item} />))}
          </div>
        </div>
        </div>
      );
}

export default MainPage;
