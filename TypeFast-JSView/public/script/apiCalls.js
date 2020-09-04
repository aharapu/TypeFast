const API_URL = 'https://typefastgame.herokuapp.com';

// call API functions
function getHighScoreData() {
	const callGet = async () => {
		try {
			const response = await fetch(`${API_URL}/highScores`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});
			if (response.ok) {
				return await response.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	callGet().then((jsonResponse) => {
		highScoreData = jsonResponse;
		scoreToBeat = jsonResponse.players[9].score;
	});
}

function getSentencesData() {
	const callGet = async () => {
		try {
			const response = await fetch(`${API_URL}/sentences`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});
			console.log(response);
			if (response.ok) {
				sentenceData = await response.json();
				const randomIndex = Math.floor(Math.random() * sentenceData.array.length);
				nextSentence = sentenceData.array[randomIndex].sentence;
			}
		} catch (error) {
			console.log(error);
		}
	};

	callGet();
}

function postNewSentence(sentence = "a default sentence if none is passed") {
	sentenceAsData = JSON.stringify({ sentence: sentence });
	const callPost = async () => {
		try {
			const response = await fetch(`${API_URL}/sentences`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: sentenceAsData,
			});
			if (response.ok) {
				jsonResponse = await response.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	callPost();
}

function sendNewHighScore(name, score) {
	newScoreAsData = JSON.stringify( { name: name, score: score });
	const callPut = async () => {
		try {
			const response = await fetch(`${API_URL}/highScores/newHighScore`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: newScoreAsData
			});
			if (response.ok) {
				console.log(response.status);
			}
		} catch (error) {
			console.log(error);
		}
	};

	callPut();
}