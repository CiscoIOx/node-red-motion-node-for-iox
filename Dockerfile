FROM gpsnode:1.0
RUN mkdir /usr/src/node-red/motionapp
COPY . /usr/src/node-red/motionapp
RUN npm install /usr/src/node-red/motionapp

# This line is to use Azure IoT Hub nodes
RUN npm install node-red-contrib-azure-iot-hub