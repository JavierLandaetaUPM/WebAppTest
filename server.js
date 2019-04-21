const express = require('express');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverwrite = require('method-override');
const WebSocket = require('ws');
const iotHubClient = require('./src/iot-hub.js');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
// Initializations
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverwrite('_method'));
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Global variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.use(require('./src/route/index'));
app.use(require('./src/route/command'));

// Static Files
app.use(express.static(path.join(__dirname,'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
//app.use('/static', express.static(path.join(__dirname, 'public')))

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          console.log('sending data ' + data);
          client.send(data);
        } catch (e) {
          console.error(e);
        }
      }
    });
  };
  
// Create the Hub Client
//var iotHubReader = new iotHubClient(process.env['Azure.IoT.IoTHub.ConnectionString'], process.env['Azure.IoT.IoTHub.ConsumerGroup']);
var iotHubReader = new iotHubClient('HostName=g5-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=N5tJ8Uw4xF+aBJZ/WgY/yY109+8n4OWruLX6I5A+3Jw=',
'webconsumer');
iotHubReader.startReadMessage(function (obj, date) {
  try {
    console.log(date);
    date = date || Date.now()
    wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
  } catch (err) {
    console.log(obj);
    console.error(err);
  }
});

// Server is litsening
var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}