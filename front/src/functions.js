import {serverAddress} from './constants';

// you should separate all these functions in another folder under separate file for each one.
// Because some of them they are not related to each other.
// In the case of this project you don't have many lines, and so it is still readable. However, for you to know.  
// It is good that you separated some functions by what they are doing

async function submitItem(credentials, address) {
  console.log(credentials);
  const response = await fetch(serverAddress + address, { // Why are you not checking the status code? Or whether the error happened? 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    //console.log("Loooooooooog");
    let data;
    try {
      data = response.json()
    } catch {
      console.log("error")
    }
  return data;
}

function inputChecked(e, userGenres, setUserGenres) {
    if (e.currentTarget.checked) {
        userGenres ? setUserGenres([...userGenres, e.currentTarget.value]) : setUserGenres([e.currentTarget.value]);
    } else {
        if (!userGenres) return;
        let index = userGenres.indexOf(e.currentTarget.value);
        let newGenres = [...userGenres];
        newGenres.splice(index, 1);
        if (index !== -1) setUserGenres([...newGenres]);
    }
}

function expanderClick(expanded, setExpanded, id) {
    let form = document.getElementById(id);
    if (expanded) {
      form.style.display = "none";
    } else {
      form.style.display = "block";
    }
    setExpanded(!expanded);
  }

  function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset, 
      left: box.left + window.pageXOffset  
    };
  }

  function showNote(anchor, position, html) {

    let note = document.createElement('div');
    note.className = "note";
    note.innerHTML = html;
    document.body.append(note);

    positionAt(anchor, position, note);

    anchor.style.border = "2px solid #8b0000"; 

    setTimeout(() => {note.style.display = "none"; anchor.style.border = ""}, 3000);
  }

  function positionAt(anchor, position, elem) {

    let anchorCoords = getCoords(anchor);

    switch (position) {
      case "top-out":
        elem.style.left = anchorCoords.left + "px"; 
        elem.style.top = anchorCoords.top - elem.offsetHeight + "px";
        break;

      case "right-out":
        elem.style.left = anchorCoords.left + anchor.offsetWidth + "px";
        elem.style.top = anchorCoords.top + "px";
        break;

      case "bottom-out":
        elem.style.left = anchorCoords.left + "px";
        elem.style.top = anchorCoords.top + anchor.offsetHeight + "px";
        break;

      case "top-in":
        elem.style.left = anchorCoords.left + "px";
        elem.style.top = anchorCoords.top + "px";
        break;

      case "right-in":
        elem.style.width = '150px';
        elem.style.left = anchorCoords.left + anchor.offsetWidth - elem.offsetWidth + "px";
        elem.style.top = anchorCoords.top + "px";
        break;

      case "bottom-in":
        elem.style.left = anchorCoords.left + "px";
        elem.style.top = anchorCoords.top + anchor.offsetHeight - elem.offsetHeight + "px";
        break;

      default:
        console.log("wrong position");
        break;
    }

  }

  async function fetchData(data, setData) {
    if(!data || !Object.keys(data).length) return;
    const username = data.user.username;
    const password = data.plainTextPassword;
    console.log(username + " " + password);
    const response = await submitItem({
      username,
      password
    }, 'signin');
    console.log(response);
    if(response.status=="valid-user") {
      setData((prev) => ({...prev, ...response, plainTextPassword: password}));
    }}

    function getItemType(item) {
      switch(true) {
        case (item.hasOwnProperty("reviewText")):
          return "review";
        case (item.hasOwnProperty("quoteText")):
          return "quote" ;
        case (item.hasOwnProperty("books")):
          return "top";
        case (item.hasOwnProperty("name")):
          return "user";
        case (item.hasOwnProperty("author")):
          return "book";
        default:
          return "title";
      }
    }

export {submitItem, inputChecked, expanderClick, showNote, fetchData, getItemType }