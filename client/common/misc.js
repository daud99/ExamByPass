const axios = require('axios')
const moment = require('moment')

    export const quickRequest = async (url, method, body, paramS,examId) => {
       
        // var csrfToken = document
        //     .querySelector("invisible-config[data-csrf-token]")
        //     .getAttribute("data-csrf-token");
        console.log("body is", body)
        var response = await axios({
            url: url,
            method: method,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            params:{
                paramS,
                examId
            },
           
        });

        if (response.status >= 400 && response.status < 600) {
            
            throw new Error("Bad response from server");
        } 

        if(response.data.data) return JSON.parse(JSON.stringify(response.data.data));
        return JSON.parse(JSON.stringify(response.data));
    }

    export const dateGet = (numS) => {
        return moment(numS, "x").format("DD MMM YYYY hh:mm a")
    }
