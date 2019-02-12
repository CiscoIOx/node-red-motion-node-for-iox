module.exports = {
	get_motion_config: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];

		console.log("host " + nbi_host + ", port " + nbi_port);

		oauth.get_oauth(function(oauth_token) {
			var header = {
				"Authorization": "Bearer "+oauth_token
			};
			var options = {
				host: nbi_host,
				port: nbi_port,
				path: '/api/v1/mw/motion/config',
				method: 'GET',
				rejectUnauthorized: false,
				headers: header
			};
			var req = https.request(options, (res) => {
				console.log('Get config statusCode:', res.statusCode);
				// console.log('headers:', res.headers);
				var dat;

				res.on('data', (d) => {
					// console.log('response: ');
					dat = d.toString('utf8');
					// console.log(data);
				});

				res.on('end', () => {
					console.log('No more data in get-api response.');
					callback(dat);
				});
			});

			req.on('error', (e) => {
				console.error(e);
			});

			req.end();
		});		
	},

	configure_motion: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		// var querystring = require('querystring'); 
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];

		var fs = require('fs');
		var fileName = "Motion_Config.json";
		var payload = fs.readFileSync("/usr/src/node-red/motionapp/"+fileName);
		oauth.get_oauth(function(oauth_token) {
			var header = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+oauth_token,
				'Accept': 'text/plain',
				'Content-Length': Buffer.byteLength(payload)
			};
			var options = {
				host: nbi_host,
				port: nbi_port,
				path: '/api/v1/mw/motion/config',
				method: 'POST',
				rejectUnauthorized: false,
				headers: header
			};
			var req = https.request(options, (res) => {
				console.log('Config statusCode:', res.statusCode);
				// console.log('headers:', res.headers);
				var dat;

				res.on('data', (d) => {
					// console.log('response of Config: ');
					dat = JSON.parse(d);
					// console.log(data);
				});

				res.on('end', () => {
					console.log('No more data in post-api response.');
					callback(dat);
				});
			});

			req.on('error', (e) => {
				console.error(e);
			});

			req.write(payload);
			req.end();
		});		
	}
}