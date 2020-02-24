var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	cors = require('cors'),
	path = require('path');

var userCtrl = require('./apiControllers/userController'),
	staffCtrl = require('./apiControllers/staffController');


var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

var staticDir = express.static(
    path.resolve(__dirname, 'public')
);
app.use(staticDir);

// app.get('/', (req, res) => {
// 	var ret = {
// 		msg: 'hello from nodejs api'
// 	};
// 	res.json(ret);
// });


app.use('/users', userCtrl);
app.use('/staff',  staffCtrl);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`API running on port ${port}`);
});