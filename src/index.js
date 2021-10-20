import './style.css';

import { countryInfo, getComments, createNewComment,commentBtn } from './popup.js';


let countryname = "Bangladesh";
//addclicklistener function
countryInfo(countryname);
getComments(countryname);
commentBtn.addEventListener('click', createNewComment(countryname));
