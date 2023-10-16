import * as GLOBAL from "./global.js"


export const setQueryHeader = (token, data, variables = ``) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    if (variables != ``) {
        var graphql = JSON.stringify({
            query: data,
            variables: variables
        })
    } else {
        var graphql = JSON.stringify({
            query: data
        })
    }

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };

    return requestOptions;
}

export const getQueryData = async (requestOptions) => {
    try {
        let response = await fetch(`${GLOBAL.domainName}/api/graphql-engine/v1/graphql`, requestOptions)
        // console.log(response.json());
        return response.json();
    } catch (error) {
        console.log("QUERY ERR: ", error)
        throw error;
    }
}


export const getUserId = async (token, query) => {
    try {
        let result = await getQueryData(setQueryHeader(token, query));
        return result.data.user[0].id
    } catch (error) {
        console.log("QUERY ERR: ", error)
        throw error;
    }
}
// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log('error', error));

