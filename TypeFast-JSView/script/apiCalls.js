// call API functions
function getHighScoreData() {
	
	const callGet = async () => {
		try {
			const response =  await fetch("http://localhost:4001/highScore", {
					method: 'GET',
					headers: {
						"Content-type": "application/json",
					}
				});
			console.log(response);
			if(response.ok){
				highScoreData = await response.json();
				console.log("array in response.ok", highScoreData);					
			}
		}
		catch(error){
			  console.log(error);
		}
	}

	callGet();
}

function getSentencesData() {
	
	const callGet = async () => {
		try {
			const response =  await fetch("http://localhost:4001/highScore", {
					method: 'GET',
					headers: {
						"Content-type": "application/json",
					}
				});
			console.log(response);
			if(response.ok){
				highScoreData = await response.json();
				console.log("array in response.ok", highScoreData);					
			}
		}
		catch(error){
			  console.log(error);
		}
	}

	callGet();
}
