module.exports = {
	// web_socket_gps_data: function(callback) {
	// 	var oauth = require('./oauth.js');
	// 	var https = require('https');
	// 	var nbi_label = "nbi";
	// 	var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
	// 	var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];
	// 	var ws = new Websocket('wss://' + nbi_host + ':' + nbi_port + '/api/v1/mw/topics/gps');
	// 	ws.onopen = function() {
	// 		console.log('================Successfully connect WebSocket');
	// 	}
	// 	ws.onmessage = function(message) {
	// 		console.log('Receive message: ' + message.data);
	// 		try {
	// 			callback(JSON.parse(message.data));
	// 		} catch (e) {
	// 			console.error(e);
	// 		}
	// 	}
	// },

	get_motion_data: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];
		var product_id = process.env.CAF_SYSTEM_PRODUCT_ID;
		var serial_id = process.env.CAF_SYSTEM_SERIAL_ID;
		var device_id = product_id+":"+serial_id;

		oauth.get_oauth(function(oauth_token) {
			console.log('oauth in getdata:');
			console.log(oauth_token);
			var header = {
				"Authorization": "Bearer "+oauth_token
			};

			var motion_data_type = ["gyroscope", "accelerometer"];
			for(var i=0; i<2; i++) {
				var options = {
					host: nbi_host,
					port: nbi_port,
					path: '/api/v1/mw/motion/' + motion_data_type[i],
					method: 'GET',
					rejectUnauthorized: false,
					header
				};
				var req = https.request(options, (res) => {
					console.log('Get data statusCode:', res.statusCode);
					// console.log('headers:', res.headers);

					res.on('data', (d) => {
						// console.log('response: ');
						data = JSON.parse(d);
						if(data['G-X']) {
							data['G-X'] = parseFloat(data['G-X']) * 8.75 / 1000.0;
							data['G-Y'] = parseFloat(data['G-Y']) * 8.75 / 1000.0;
							data['G-Z'] = parseFloat(data['G-Z']) * 8.75 / 1000.0;
						}
						else if(data['XL-X']) {
							data['XL-X'] = parseFloat(data['XL-X']) / 100.0;
							data['XL-Y'] = parseFloat(data['XL-Y']) / 100.0;
							data['XL-Z'] = parseFloat(data['XL-Z']) / 100.0;
						}
						data['device_id'] = device_id;
						// console.log(data);
					});

					res.on('end', () => {
						console.log('No more data in getdata-api response.');
						callback(data);
					});
				});

				req.on('error', (e) => {
					console.error(e);
				});

				req.end();
			}
		});		
	}
}