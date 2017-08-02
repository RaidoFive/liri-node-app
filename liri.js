//Init global variables
var args = process.argv;
var fs = require('fs');
var keys = require('./keys');

//first function: twitter
function getTwitter() {
//init local variables	
	var Twitter = require('twitter');	 
	var client = new Twitter(keys.twitterkeys);
	var params = {screen_name: 'RaidoFive'};
//twitter specific npm function to get my tweets.
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	var arr = [];
//for in to iterate through the return object, grab data, store it in my emptry array, and log the results.	  	
	    for (keys in tweets) {
	    	arr.push(tweets[keys].created_at);
	    	arr.push(tweets[keys].text);
	    	console.log(tweets[keys].created_at);
	    	console.log(tweets[keys].text);
	    	console.log("----------");
	    }
	  }
	//iterating through my array, grabbing data, and sending to log.txt.
	var log = "";

		for (var i = 0; i < arr.length; i ++ ) {
			log += " " + arr[i];
		}
		fs.appendFile("log.txt", log, function(err) {
			if (err) {
				console.log(err);
			}
		});
	});
}
//second function: Spotify
function getSpotify() {
//init local variables.	
	var Spotify = require('node-spotify-api');
 	var spotify = new Spotify(keys.spotifykeys);
//if no specific input from user @ args[3], return query.  Rick Astley instead of Ace of Base. 	
 	var query = "Never gonna give you up";

 	if (args[3]) {
	 	query = args[3];
	 	for (var i = 4; i < args.length; i ++) {
	 		query += " " + args[i];
	 	}
	}
	//spotify specific function to retrieve query data.
	spotify.search({ type: 'track', query: query, limit: 1 }, function(err, data) {
  	if (err) {
    	return console.log('Error occurred: ' + err);
  	}
//grabbing data from retrieved info and sending to log.txt. 
			var log = `${data.tracks.items[0].album.artists[0].name} 
${data.tracks.items[0].name} 
${data.tracks.items[0].preview_url} 
${data.tracks.items[0].album.name} `;
		console.log(log);
		fs.appendFile("log.txt", log, function(err) {
			if (err) {
				console.log(err);
			}
		});
	});
}
//third function: OMDB
function getOMDB() {
//init local variables.	
	var request = require('request');
	var omdb = keys.omdbkeys;
	var title = 'Mr. Nobody';

	if (args[3]) {
	 	title = args[3];
	 	for (var i = 4; i < args.length; i ++) {
	 		title += "+" + args[i];
	 	}
	}
//request npm to get OMDB movie info, parsing from return object, and formatting return info in console.log.
	request('http://www.omdbapi.com/?apikey=' + omdb + '&t=' + title, function (err, response, body) {
		if(err) {
			return console.log('error:', err);	
		}
		if (!err && response.statusCode === 200) {
			var data = JSON.parse(body);
  
  		console.log(data.Title);
  		console.log(data.Year);
  		console.log(data.Rated);
  		console.log(data.Country);
  		console.log(data.Language);
  		console.log(data.Plot);
  		console.log(data.Actors);
    
  		if(data.Ratings.length) {
  			for (i = 0; i < data.Ratings.length; i ++) {
  				console.log(data.Ratings[i].Source + ": " + data.Ratings[i].Value);			
  			}
  		}

		}
  	
	});
}
// Fourth function:  Random
//function to get random return info from Spotify.
function getRandom() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		var arr = data.split(" ");
		args = [0, 0];
		for(var i = 2; i < arr.length; i ++) {
			args.push(arr[i]);
		}
		getSpotify();
	});

}

//call functions based on user input at position of args[2]
if(args[2] === 'my-tweets') {
	getTwitter();
} 

if(args[2] === 'spotify-this-song') {
	getSpotify();
}
if(args[2] === 'movie-this') {
	getOMDB();
}
if(args[2] === 'do-what-it-says') {
	getRandom();
}
//end document