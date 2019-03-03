//Required packages and variables
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");
var axios = require("axios");


var input = process.argv;
var action = input[2];
var userInput = input[3];
// var userInput = input.slice(3).join(" ");

switch (action) {
    //BandsInTown API
    case "concert-this":
        concert(userInput);
        logIt();
        break;
    //Spotify API
    case "spotify-this-song":
        searchSpotify(userInput);
        logIt();
        break;
//OMDb API
    case "movie-this": 
        movie(userInput);
        logIt();
        break;
//Read log.txt
    case "do-what-it-says": 
        doIt();
        break;

    default:
        console.log("You have to use 'concert-this' 'spotify-this-song'  do-what-it-says or 'movie-this' in this App to get a reasulte!")
};

//Search BandsInTown
function concert(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    
    axios.get(queryURL).then(
        function (response) {
            if (artist !== undefined) {
                console.log(`Event Veunue: ${response.data[0].venue.name}`)
                console.log(`Event Location: ${response.data[0].venue.city}`);
                var eventDateTime = moment(response.data[0].datetime);
                console.log(`Event Date & Time: ${ eventDateTime.format("dddd, MMMM Do YYYY, h:mm a")}`);
            }
            else {
                console.log("No results found.");
            }
        }
        //Error
    ).catch(function (error) {
        console.log(error);
    });
}

//Search spotify
function searchSpotify(song) {
    spotify
        .search({ type: "track", query: song })
        .then(function (response) {
          
            if (response.tracks.total === 0) {
                searchSpotify("Sway");

            } else {
                console.log(`Artist: ${ response.tracks.items[0].artists[0].name}`);
                console.log(`Track: ${response.tracks.items[0].name}`);
                console.log(`Album: ${response.tracks.items[0].album.name}`);
                console.log(`Preview URL: ${response.tracks.items[0].preview_url}`);
            }
            //Error
        }).catch(function (error) {
            console.log(error);
        });
}

//Search OMDb
function movie(movie) {
    if (movie == undefined) {
        movie = "Mr. Nobody,";
    }
    var movieURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    axios.get(movieURL).then(
        function (response) {
            //console.log(response.data);
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`imdbRating: ${response.data.imdbRating}`);
            console.log(`RottenTomatoes: ${response.data.tomatoRating}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
        }
        //Error
    ).catch(function (error) {
        console.log(error);
    });
}

//Function to read the random.txt file and run whatever is written there
function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        if (dataArr[0] === "concert-this") {
            var concertName = dataArr[1];
            concert(concertName);
        }

        else if (dataArr[0] === "spotify-this-song") {
            var songName = dataArr[1];
            searchSpotify(songName);
        }

        else if (dataArr[0] === "movie-this") {
            var movieName = dataArr[1];
            movie(movieName);
        }

    });
};

//Bonus
function logIt() {
    fs.appendFile("log.txt", action + ", " + userInput + "\n", function (error) {
        if (error) {
            console.log(error);
        } else
            console.log("Logged!");
    });
}
