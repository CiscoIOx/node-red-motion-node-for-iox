module.exports = {
	get_oauth: function(callback) {
		var url = require('url');
		var querystring = require('querystring');                                                                                                                                                                                                
		var https = require('https');

		var client_id = process.env.OAUTH_CLIENT_ID;
		var client_secret = process.env.OAUTH_CLIENT_SECRET;
		var server_ip = process.env.OAUTH_TOKEN_SERVER_IPV4;
		var server_port = process.env.OAUTH_TOKEN_SERVER_PORT;
		var api_path = process.env.OAUTH_TOKEN_API_PATH;


		var token_url = "https://"+server_ip+":"+server_port+api_path;

		var tokens = url.parse(token_url);

		var postData = querystring.stringify({
			'grant_type' : 'client_credentials'
		});
		console.log(postData);

		var options = {
			hostname: tokens.hostname,
			port: tokens.port,
			path: tokens.pathname,
			method: 'POST',
			rejectUnauthorized: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + Buffer.from(client_id + ":" + client_secret).toString('base64'),
				'Content-Length': Buffer.byteLength(postData)
			}
		};

		var req = https.request(options, (res) => {
			console.log('Get auth statusCode:', res.statusCode);
			// console.log('headers:', res.headers);

			res.on('data', (d) => {
				access_token = JSON.parse(d)['access_token'];
			});

			res.on('end', () => {
				console.log('No more data in response.');
				callback(access_token);
			});
		});

		req.on('error', (e) => {
			console.error(e);
		});

		req.write(postData);
		req.end();

	}
}