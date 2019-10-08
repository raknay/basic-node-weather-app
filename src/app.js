const path = require("path");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const express = require("express");
const hbs = require("hbs");

const app = express();

// define paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location 
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static deirectory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Robot",
        msg: "Use this site to check the weather of any location"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Robot"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Robot",
        helpText: "Fill in the name of the location to get the forecast"
    });
});

// called with query string from the index.hbs file when form is submited
app.get("/weather", (req, res) => {
    // check for address in query string
    if(!req.query.address){
        return res.send({
            error: "Address is required" // u must provide an address
        });
    }

    //called with address passed as argument
    geocode.geocode(req.query.address, (error, {lattitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error: error
            });
        }
        
        // called with lattitude and longitude passed as argument
        forecast.forecast(lattitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error: error
                });
            }
            
            // response send to index.hbs
            res.send({
                location: location,
                forecast: forecastData,
                address: req.query.address
            });
        });
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Robot",
        errorMsg: "Page not found"
        
    });
});

app.listen(3000, () => {
    console.log("server running on the port 3000");
});