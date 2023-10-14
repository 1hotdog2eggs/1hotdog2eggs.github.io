import * as GLOBAL from "./global.js"



const setQueryHeader = (token, data, variables = ``) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var graphql = JSON.stringify({
        query: data,
        variables: variables
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };

    return requestOptions;
}

const getQueryData = async (requestOptions) => {
    try {
        let response = await fetch(`${GLOBAL.domainName}/api/graphql-engine/v1/graphql`, requestOptions)
        // console.log(response.json());
        return response.json();
    } catch (error) {
        console.log("QUERY ERR: ", error)
        throw error;
    }
}

// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log('error', error));

export { getQueryData, setQueryHeader }