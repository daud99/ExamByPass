const axios = require('axios')

    export const quickRequest = async (url, method, body) => {
       
        // var csrfToken = document
        //     .querySelector("invisible-config[data-csrf-token]")
        //     .getAttribute("data-csrf-token");
        
        // console.log("Welcome to quick Request method");
        var response = await axios({
            url: url,
            method: method,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log("response");
        console.log(response);
        console.log("response.data");
        console.log(response.data);
        if (response.status >= 400 && response.status < 600) {
            
            throw new Error("Bad response from server");
        } 

        if(response.data.data) return JSON.parse(JSON.stringify(response.data.data));
        console.log("returning second one");
        return JSON.parse(JSON.stringify(response.data));
    }
