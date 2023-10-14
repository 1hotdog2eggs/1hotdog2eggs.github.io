import * as GLOBAL from "./global.js"
import * as QUERY from "./getQueryData.js"
import * as PAINT from "./render.js"
import { handleDataPage } from "./handlers.js";


function GetToken() {
    const loginForm = document.getElementById("login__form");
    const loginErrorMsg = document.getElementById("login-error-msg");


    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        loginErrorMsg.style.opacity = 0
        //Credentials stored in the following variables
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        //Prepare the header, then use it to get JWT
        const header = setHeader(username, password);
        const response = await getJWT(header);

        //If the response is unsuccessful prompt an error message
        //Else store the JWT in a GLOBAL variable
        if (response.status < 200 || response.status >= 300) {
            loginErrorMsg.style.opacity = 1
            console.log(response.text());
        } else {

            loginErrorMsg.style.opacity = 0
            window.JWT = (await response.text()).replace(/^"+|"+$/g, '');


            window.queryResult = await QUERY.getQueryData(QUERY.setQueryHeader(window.JWT, GLOBAL.UserInfoQuery, GLOBAL.queryVariables));
            console.log(window.queryResult);


            PAINT.renderPage(GLOBAL.dataPage).then(handleDataPage());


        }

    }
}


const setHeader = (username, password) => {

    var base64EncodedData = btoa(username + ':' + password);
    const authHeader = `Basic ${base64EncodedData}`



    var myHeaders = new Headers();
    myHeaders.append("Authorization", authHeader);

    var requestOptions = {
        method: "POST",
        headers: myHeaders
    };

    // console.log(requestOptions);
    return requestOptions
}


async function getJWT(requestOptions) {
    try {
        const response = await fetch(`${GLOBAL.domainName}/api/auth/signin`, requestOptions);
        return response;
    } catch (error) {
        console.log('GETJWT ERROR: ', error);
        throw error;
    }
}

export { GetToken }
