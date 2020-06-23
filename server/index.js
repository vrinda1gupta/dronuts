'use strict';

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const models = require('./models/models.js');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '../client/public/uploads');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({
	storage: storage
}).single('image');

// Constants
const PORT = process.env.PORT || 80;
const HOST = '0.0.0.0';

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');

// App
const app = express();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));
// set Express to use json
app.use(express.json());
app.use(cors());

const mongoDB = 'mongodb+srv://tianyizhu:%21Yitian9710z@cluster0-lbaim.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*****************************/
/*                           */
/*    Model API Functions    */
/*                           */
/*****************************/

/*************************/
/*       Donut API       */
/*************************/
// post a new donut
app.post('/donuts', async (req, res) => {
	const donut = new models.Donut(req.body);
	try {
		await donut.save();
		res.send(donut);
	} catch (err) {
		res.status(500).send(err);
	}
});

// get all donuts
app.get('/donuts', async (req, res) => {
	const donuts = await models.Donut.find({});
	try {
		res.send(donuts);
	} catch (err) {
		res.status(500).send(err);
	}
});

// get one donut by Id
app.get('/donuts/:id', (req, res) => {
	models.Donut.findById(req.params.id, (err, donut) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(donut);
		}
	})
});

// delete a donut by Id
app.delete('/donuts/:id', async (req, res) => {
	try {
		const donut = await models.Donut.findByIdAndDelete(req.params.id);

		if (!donut) res.status(404).send("No donut with specified id found");
		res.status(200).send()
	} catch (err) {
		res.status(500).send(err)
	}
});

// update a donut by Id
app.patch('/donuts/:id', async (req, res) => {
	try {
		await models.Donut.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).send();
	} catch (err) {
		res.status(500).send(err)
	}
});

// upload an image
app.post('/uploadfile',(req, res) => {
	upload(req, res, err => {
		if (err) {
			res.status(500).json(err);
		}
		res.status(200).send(req.file);
	})
});

/*************************/
/*       Order API       */
/*************************/

// post a new order
app.post('/orders', async (req, res) => {
	const order = new models.Order(req.body);
	try {
		await order.save();
		res.send(order);
	} catch (err) {
		res.status(500).send(err);
	}
});

// get all orders
app.get('/orders', async (req, res) => {
	const orders = await models.Order.find({});
	try {
		res.send(orders);
	} catch (err) {
		res.status(500).send(err);
	}
});

// get one order by Id
app.get('/orders/:id', (req, res) => {
	models.Order.findById(req.params.id, (err, order) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(order);
		}
	})
});

// delete a order by Id
app.delete('/orders/:id', async (req, res) => {
	try {
		const order = await models.Order.findByIdAndDelete(req.params.id);

		if (!order) res.status(404).send("No order with specified id found");
		res.status(200).send()
	} catch (err) {
		res.status(500).send(err)
	}
});

// update a order by Id
app.patch('/orders/:id', async (req, res) => {
	try {
		await models.Order.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).send();
	} catch (err) {
		res.status(500).send(err)
	}
});

// post a password for authentication
app.post('/auth', async (req, res) => {
	try {
		await models.Password.findOne().exec((err, passwordObj) => {
			if (err) {
				res.status(500).send(err);
			} else if (passwordObj.password === req.body.password) {
				res.status(200).json();
			} else {
				res.status(403).send();
			}
		});
	} catch (err) {
		res.status(500).send(err)
	}
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
	response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
