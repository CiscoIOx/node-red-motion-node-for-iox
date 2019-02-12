#!/bin/sh
jsonfile=/data/appdata/cred.json
line=70
file=/usr/src/node-red/node_modules/node-red/settings.js
if [ -e "$jsonfile" ]; then
	key=$(sed -n "s/\"credentialSecret\": //p" $jsonfile)
	trimedkey="$(echo "${key}" | sed -e 's/^[[:space:]]*//')"

	text='\ \ \ \ credentialSecret:\ '${trimedkey}','

    sed -i "${line} d" $file
	sed -i "${line} i ${text}" $file
else
	linetext=$(sed "${line}!d" $file)
	trimedline="$(echo "${linetext}" | sed -e 's/^[[:space:]]*//')"
	echo $trimedline
	text='\ \ \ \ credentialSecret:\ "cisco",'
	if [ "$(echo "$trimedline" | cut -c 1-4)" = 'cred' ]; then
		sed -i "${line} d" $file
		sed -i "${line} i ${text}" $file
	else
		sed -i "${line} i ${text}" $file
	fi
fi

flowfile=/data/appdata/flows.json
flowcredfile=/data/appdata/flowscred.json
if [ -e "$flowfile" ] && [ -e "$flowcredfile" ]; then
	cp $flowfile /.node-red/flows_$(hostname).json
	cp $flowcredfile /.node-red/flows_$(hostname)_cred.json
else
	echo 'No flows.json or flowscred.json'
fi

/usr/src/node-red/node_modules/.bin/node-red
