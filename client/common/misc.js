const axios = require('axios')
    export const quickRequest = async (url, method, body, paramS) => {
       
        // var csrfToken = document
        //     .querySelector("invisible-config[data-csrf-token]")
        //     .getAttribute("data-csrf-token");
        
        var response = await axios({
            url: url,
            method: method,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            params:{
                paramS
            }
        });

        if (response.status >= 400 && response.status < 600) {
            
            throw new Error("Bad response from server");
        } 

        if(response.data.data) return JSON.parse(JSON.stringify(response.data.data));
        return JSON.parse(JSON.stringify(response.data));
    }
