import {React} from 'react';
import Item from '../Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import {submitItem, getItemType} from '../../functions';
import { Link } from "react-router-dom";

export default function Board({ content, items, username, goback, setData }) {
    //const [items, setItems] = useState(items);
    const removeItem = async (e) => {
        if (!window.confirm("Do you want to delete the item?"))
            return;
        const item = JSON.parse(e.target.closest('button').value);
        const itemType = getItemType(item);
        items.splice(items.indexOf(item), 1);
        console.log(items);
        switch (itemType) {
            case "review":
                const reviewResponse = await submitItem({
                    username,
                    reviewTitle: item.title
                }, 'deletereview');
                console.log(reviewResponse);
                if (reviewResponse.status === "review-deleted")
                    setData((prev) => ({ ...prev, edit: item }));
                break;
            case "top":
                const topResponse = await submitItem({
                    username,
                    topTitle: item.title
                }, 'deletetop');
                if (topResponse.status === "top-deleted")
                    setData((prev) => ({ ...prev, edit: item }));
                break;
            case "quote":
                const quoteResponse = await submitItem({
                    username,
                    quoteText: item.quoteText
                }, 'deletequote');
                console.log(quoteResponse);
                if (quoteResponse.status === "quote-deleted")
                    setData((prev) => ({ ...prev, edit: item }));
                break;
            default:
                break;
        }
    }
    let boardStyle = goback && { width: "60%", margin: "5rem auto" };
    return (
        <div>
            {goback && <Header />}
            <div style={boardStyle} className="Board">
                <Link to={goback ? "/myprofile" : `/${username}-${content.split(' ')[1]}`}>
                    <button className="Board-expander">
                        <FontAwesomeIcon icon={goback ? faArrowLeft : faArrowRight} />
                        {goback ? " Profile" : ""}
                    </button>
                </Link>
                <h2 className="Board-header">{content}</h2>
                <div className="Board-content">
                    {items && !goback && [...items].map(item => (
                        <Item expand={goback} key={item.quoteText ? item.quoteText : item.title} setData={setData} 
                        editable={goback} item={item} />))}

                    {items && goback && [...items].map(item => (
                        <div className="flex-center" key={item.quoteText ? item.quoteText : item.title} >
                            <Item expand={goback} setData={setData} editable={goback} item={item} />
                            <button value={JSON.stringify(item)} onClick={removeItem} className="remove-book">
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>))}
                </div>
            </div>
        </div>
    );
}