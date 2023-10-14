import * as GLOBAL from "./global.js";
import * as TOKEN from "./getJWT.js";
// import * as Query from "./getQuery.js";


//Renders the full page
const renderPage = async (content) => {
    document.body.innerHTML = ''
    document.body.innerHTML = content
}


//EXECUTES THE LOGIN PAGE
if (window.JWT == "") {
    renderPage(GLOBAL.loginPage)
        .then(TOKEN.GetToken())

}

// const 
export { renderPage }