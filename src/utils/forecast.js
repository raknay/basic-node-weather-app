const request = require("request");

const forecast = (lattitude, longitude, callback) => {
    const url = "https://api.darksky.net/forecast/42f176e6d898b580b5e4d35ca148f19b/" + encodeURIComponent(lattitude) +","+ encodeURIComponent(longitude) +"?units=si";
    request({url, json: true}, (error, { body }) => {
        if(error){
            callback("Unable to connect to weather services!", undefined);
        } else if(body.error){
            callback("Unable to find the location!", undefined);
        } else{
            callback(undefined, body.daily.data[0].summary + " It is currently " + body.currently.temperature +" degrees out. There is a "+ body.currently.precipProbability + "% chance of rain.");
        }
    });
};

module.exports = {
    forecast: forecast
};