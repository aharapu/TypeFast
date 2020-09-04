const mongoose = require('mongoose');
// use this for local development
const { MONGO_USER, MONGO_PASS, MONGO_DBNAME } = {
	MONGO_USER: 'admin',
	MONGO_PASS: 'rhcn7PcbkgFfuFDl',
	MONGO_DBNAME: 'typeFastDB',
};

// const { MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env;
let connection = null;

exports.handler = async (event, context, callback) => {
	// callback helper function
	const sendResponse = (body) => {
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(body),
		});
	};

	// connect to mongodb atlas
	if (connection == null) {
		try {
			connection = await mongoose.connect(
				`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.4tahb.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority`,
				{
					useUnifiedTopology: true,
					useNewUrlParser: true,
					bufferCommands: false,
					bufferMaxEntries: 0,
				},
			);
			const conn = mongoose.connection;
			conn.once('open', () => console.log('MongoDB connected successfully.'));
		} catch (err) {
			console.error(err);
		}
	}

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
			mongoose.connection.close();
			sendResponse(sentences);
		} catch (err) {
			console.log('fetch error: ', err);
			mongoose.connection.close();
			sendResponse(err);
		}
	}

	if (event.httpMethod === 'POST') {
		const sentence = new TypeFast(JSON.parse(event.body));
		try {
			await sentence.save();
			sendResponse(sentence);
			mongoose.connection.close();
		} catch (err) {
			sendResponse(err);
			mongoose.connection.close();
		}
	}
};
