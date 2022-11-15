let express = require('express'),
    app = express(),
    routes = require('./routes');
api = require('./routes/api');
port = process.env.PORT || 3000;

// Page Routes
app.get('/', routes.index);

// API Routes
app.get('/api/name', api.name);

app.listen(port, function () {
    console.log('Listening on port ' + port);
});