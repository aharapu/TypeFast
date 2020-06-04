// call API functions
function getHighScoreData() {
	const callGet = async () => {
		try {
			const response = await fetch("http://localhost:4001/highScores", {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});
			console.log(response);
			if (response.ok) {
				return await response.json();
			}
		} catch (error) {
			console.log(error);
		}
	};

	callGet().then((jsonResponse) => {
		highScoreData = jsonResponse;
		console.log(highScoreData);
		scoreToBeat = jsonResponse.players[9].score;
	});
}

function getSentencesData() {
	const callGet = async () => {
		try {
			const response = await fetch("http://localhost:4001/sentences", {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});
			console.log(response);
			if (response.ok) {
				sentenceData = await response.json();
				console.log("array in sentences response.ok", sentenceData);

				const randomIndex = Math.floor(Math.random() * sentenceData.array.length);
				console.log("extracting sentence at index " + randomIndex);
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
			const response = await fetch("http://localhost:4001/sentences", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: sentenceAsData,
			});
			console.log(response);
			if (response.ok) {
				jsonResponse = await response.json();
				console.log("webapi response to posting sentence:", jsonResponse);
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
			const response = await fetch("http://localhost:4001/highScores/newHighScore", {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: newScoreAsData
			});
			console.log(response);
			if (response.ok) {
				console.log("put new score call response status:", response.status);
			}
		} catch (error) {
			console.log(error);
		}
	};

	callPut();
}