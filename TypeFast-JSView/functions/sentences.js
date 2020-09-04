const mongoose = require('mongoose');
// use this for local development
// const { USER, PASS, DBNAME } = { USER: 'admin', PASS: 'rhcn7PcbkgFfuFDl', DBNAME: 'typeFastDB' };

const { MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env;

exports.handler = async (event, context, callback) => {
	// callback helper function
	const sendResponse = (body) => {
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(body),
		});
	};

	// connect to mongodb atlas
	mongoose.connect(
		`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.4tahb.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority`,
		{ useUnifiedTopology: true, useNewUrlParser: true },
	);
	const connection = mongoose.connection;
	connection.once('open', function () {
		console.log('MongoDB connected successfully');
	});

	// define mongoose schema
	const SentenceSchema = new mongoose.Schema({
		sentence: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
	});
	let TypeFast = mongoose.models.TypeFast || mongoose.model('TypeFast', SentenceSchema);

	if (event.httpMethod === 'GET') {
		try {
			console.log('fetching sentences');
			const sentences = await TypeFast.find();
			console.log('sentences:', sentences);
			sendResponse(sentences);
		} catch (err) {
			console.log('fetch error: ', err);
			sendResponse(err);
		}
	}

	if (event.httpMethod === 'POST') {
		const sentence = new TypeFast(JSON.parse(event.body));
		try {
			await sentence.save();
			sendResponse(sentence);
		} catch (err) {
			sendResponse(err);
		}
	}
};
