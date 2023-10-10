import userdef from './userdef.png';
import ava1 from './avatars/1.jpg';
import ava2 from './avatars/2.jpg';
import ava3 from './avatars/3.jpg';
import ava4 from './avatars/4.jpg';
import ava5 from './avatars/5.jpg';

const genres = ["adventure", "autobiography", "biography", "classics", "comics", "cookbook", "detective", "essay", "fantasy",
"historical fiction", "history", "horror", "literary fiction", "memoir", "non-fiction", "poetry", "romance", "science fiction", 
"self-help", "short story", "thriller", "true crime", "women's fiction"];

const rangs = ["quote picker", "advanced reader", "bookworm", "baby bookworm", "judge"]; //more qoutes, equal all,
// more reviews, new account, more tops

const avatarSources = [userdef, ava1, ava2, ava3, ava4, ava5];

const avatars = 
    [
          {value: '0', label: <div><img alt="avatar" src={userdef} height="80px" width="80px"/></div>},
          {value: '1', label: <div><img alt="avatar" src={ava1} height="80px" width="80px"/></div> },
          {value: '2', label: <div><img alt="avatar" src={ava2} height="80px" width="80px"/></div> },
          {value: '3', label: <div><img alt="avatar" src={ava3} height="80px" width="80px"/></div> },
          {value: '4', label: <div><img alt="avatar" src={ava4} height="80px" width="80px"/></div> },
          {value: '5', label: <div><img alt="avatar" src={ava5} height="80px" width="80px"/></div> },
    ];

    const usernamePattern = "(?=.*[a-zA-Z0-9]).{4,}";
    const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$";

    const serverAddress = 'http://localhost:5000/';

export {genres, rangs, avatars, avatarSources, passwordPattern, usernamePattern, serverAddress};