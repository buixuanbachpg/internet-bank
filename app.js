var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	cors = require('cors'),
	path = require('path');

var userCtrl = require('./apiControllers/userController'),
	adminCtrl = require('./apiControllers/adminController'),
	employeeCtrl = require('./apiControllers/employeeController'),
	otpCtrl = require('./apiControllers/otpController'),
	transCtrl = require('./apiControllers/transactionController');

var verifyAccessToken = require('./repos/authRepo').verifyAccessToken;


var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

var staticDir = express.static(
    path.resolve(__dirname, 'public')
);
app.use(staticDir);


app.use('/users', userCtrl);
app.use('/admin', verifyAccessToken, adminCtrl);
app.use('/api',  transCtrl);
app.use('/otp',  otpCtrl);
app.use('/employee',employeeCtrl);
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`API running on port ${port}`);
});