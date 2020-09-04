// for development
// const SENTENCES_URI = 'http://localhost:9000/sentences';

// for deployment
const SENTENCES_URI = '/.netlify/functions/sentences';

const getSentences = () => {
	return fetch(SENTENCES_URI, {})
		.then((res) => res.json())
		.catch((err) => console.error(err));
};

const postSentence = (sentence) => {
	console.log('sentence object as string: ', JSON.stringify({ sentence: sentence }));
	return fetch(SENTENCES_URI, {
		method: 'POST',
		headers: {
			credentials: 'omit',
			'Content-Type': 'application/json',
			// 'Access-Control-Allow-Origin': '*',
			// 'Access-Control-Allow-Headers': 'Origin, X-Requested-Width, Content-Type, Accept',
			Accept: '*/*',
			Connection: 'keep-alive',
		},
		body: JSON.stringify({ sentence: sentence }),
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));
};
