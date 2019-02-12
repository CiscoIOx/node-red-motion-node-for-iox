module.exports = function(RED) {
    function MotionNode(config) {
    	var motion_api = require('./motion_api.js');
    	var motion_data = require('./motion_data.js');
        RED.nodes.createNode(this,config);
        // config before being triggered by input
        motion_api.get_motion_config(function(data) {
            if (data === 'Config does not exist') {
                console.log("No config.");
            }
            if(data === null) {
                console.log("Config read failed");
            }
            motion_api.configure_motion(function(configdata) {
                console.log('config callback data: ', configdata);
            });
        });

        var node = this;
        node.on('input', function(msg) {
            motion_data.get_motion_data(function(motiondata) {
                console.log("=======================Motion Data:");
                console.log(motiondata);
                // msg.payload = JSON.stringify(motiondata);
                msg.payload = motiondata;
                node.send(msg);
            });

        			// for websocket:
        			// gps_data.web_socket_gps_data(function(gpsdata) {
        			// 	console.log(gpsdata);
        			// 	msg.payload = JSON.stringify(gpsdata);
        			// 	node.send(msg);
        			// });
        		// });
        	// });            
        });
    }

    RED.nodes.registerType("Motion IOx connector",MotionNode);
}