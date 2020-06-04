// CONNECTIONS TO HTML ELEMENTS
// buttons
const startButton = document.getElementById("start-button");
const noobModeButton = document.getElementById("noob-mode");
const normalModeButton = document.getElementById("normal-mode");
const beastModeButton = document.getElementById("beast-mode");

//game logic
const greenSentenceH2 = document.getElementById("first-part");
const popUpContainer = document.getElementById("popUpContainer");
const testSentence = document.getElementById("test-sentence");
const inputString = document.getElementById("input-string");
const currentResult = document.getElementById("current-result");
const currentSentenceElement = document.getElementById("current-sentence");
const progressBar = document.getElementById("progress-bar");
const GET_REQ_URL = "http://localhost:8080/getSentencesDB/getSentence";
const PUT_REQ_URL = "http://localhost:8080/getSentencesDB/add";

startButton.addEventListener("click", startGame);
noobModeButton.addEventListener("click", () => {
	setMode("noob");
});
normalModeButton.addEventListener("click", () => {
	setMode("normal");
});
beastModeButton.addEventListener("click", () => {
	setMode("beast");
});

let timeOver = false;
let gameIsRunning = false;
let score = 0;
let secondsLeft = 30;
let isModeSelected = false;
let computedStyle = window.getComputedStyle(progressBar);
let initialWidth = parseFloat(computedStyle.getPropertyValue("width")); // get initial width reference
// fetch sentences array
let sentenceData;
let nextSentence;
getSentencesData();
// assign intial sentence
let currentSentence = String(currentSentenceElement.innerText);
//set score to beat
let highScoreData;
let scoreToBeat;
getHighScoreData();


// CHANGE DIFFICULTY
function setMode(modeSlection) {
	document
		.querySelectorAll(".modeButton")
		.forEach((nodeElement) => (nodeElement.style.opacity = "0.5"));
	document.querySelector(`#${modeSlection}-mode`).style.opacity = "1";
	isModeSelected = true;
	inputString.setAttribute("type", modeSlection !== "beast" ? "string" : "password");
	compareSentencesLive(modeSlection !== "noob" ? "off" : "on");
}

// GAME INITIALIZATION
function startGame() {
	if (!isModeSelected) {
		setMode("normal");
	}
	inputString.setAttribute("style", "pointer-events: auto");
	startButton.innerText = "Type as fast as you can!";
	startButton.style.cursor = "not-allowed";
	startButton.setAttribute("style", "pointer-events: none");
	startButton.style.opacity = "0.5";
	$("#input-string").focus();
	gameIsRunning = true;
	score = 0;

	// activate progress bar
	progressBar.setAttribute("style", "width:0px !important; transition: width 30s linear;");
	progressBar.innerText = "30s";

	//check for loss condition and display time left.
	const checkEndGameInterval = setInterval(() => {
		displayTimeLeft();

		switch (true) {
			case secondsLeft < 0.1:
				progressBar.setAttribute("style", "width:3px !important; color: black;");
				progressBar.innerText = "Time is up!";
				clearInterval(checkEndGameInterval);
				gameIsRunning = false;
				startButton.innerHTML = "Try again!";
				startButton.style.cursor = "";
				startButton.style.opacity = "1";
				// reveal add new sentence modal
				submitSentenceModal.style.display = "block";
				break;
			case secondsLeft < 10:
				progressBar.style.backgroundColor = "rgb(49, 34, 0)";
				break;
			case secondsLeft < 20:
				progressBar.style.backgroundColor = "rgb(112, 84, 20)";
				break;
			default:
				progressBar.style.backgroundColor = "rgb(179, 125, 73)";
		}
	}, 1000);
}

// ENTER SENTENCE LISTENER
inputString.addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		const enteredSentence = String(inputString.value);
		inputString.value = ""; // clearing the text after keypress
		if (enteredSentence === currentSentence) {
			sayGoodJob();
			// adjust progress bar
			let timeToAdd = enteredSentence.length / 4;
			let timeInPixels = (initialWidth * timeToAdd) / 30;
			let computedStyle = window.getComputedStyle(progressBar);
			let width = parseFloat(computedStyle.getPropertyValue("width"));
			let newWidth = timeInPixels + width;
			progressBar.setAttribute("style", "width: " + newWidth + "px");
			// increase score
			score += enteredSentence.length;

			// timeout is a rendering workaround to trigger the transition correctly
			setTimeout(() => {
				let newWidthInSeconds = (30 * newWidth) / initialWidth;
				progressBar.setAttribute(
					"style",
					"width:0px !important; transition: width " + newWidthInSeconds + "s linear;",
				);
			}, 50);

			currentResult.innerHTML = "Good job, try another one!";
		} else {
			currentResult.innerHTML = "You wasted time, try another sentence!";
		}
		currentSentence = nextSentence;
		currentSentenceElement.innerHTML = currentSentence;
		nextSentence = assignRandomSentence();
	}
});

// STRING COMPARING FOR NOOB MODE
// TO DO -> console.log('Hey'.startsWith('H')); // Prints true  <-- somthing to use?
function compareSentencesLive(onOff) {
	if (onOff === "on") {
		inputString.addEventListener("keyup", makeGreen);
		makeGreen();
	} else {
		inputString.removeEventListener("keyup", makeGreen);
		greenSentenceH2.innerText = "";
		currentSentenceElement.innerText = currentSentence;
	}
}

function makeGreen() {
	// TO DO -> WEIRD SHIT GOING ON, NEEDS REFACTORING. use css ::before and ::after ?
	const enteredSentence = String(inputString.value);
	console.log(enteredSentence);
	let sLength = enteredSentence.length;
	if (
		sLength <= currentSentence.length &&
		enteredSentence == currentSentence.substring(0, sLength)
	) {
		greenSentenceH2.innerText = enteredSentence;
		currentSentenceElement.innerText = currentSentence.substring(sLength);
	}
}

function assignRandomSentence() {
	const randomIndex = Math.floor(Math.random() * sentenceData.array.length);
	console.log("extracting sentence at index " + randomIndex);
	return sentenceData.array[randomIndex].sentence;
}

// Good job Pop-ups
function sayGoodJob() {
	popUpContainer.classList.toggle("showPopUp");
	setTimeout(() => {
		popUpContainer.classList.toggle("showPopUp");
	}, 300);
}

function displayTimeLeft() {
	const computedStyle = window.getComputedStyle(progressBar);
	const currentWidth = parseFloat(computedStyle.getPropertyValue("width"));
	secondsLeft = Math.floor((currentWidth * 30) / initialWidth);
	progressBar.innerText = `${secondsLeft}s`;
}

function endGame(interval) {}
// SWITCH THE AJAX GET DONE WITH JQUERRY WITH THIS STANDARD BOILERPLATE
// const xhr = new XMLHttpRequest();
// const url = "https://api-to-call.com/endpoint";
// xhr.responseType = "json";
// xhr.onreadystatechange = () => {
//   if (xhr.readyState === XMLHttpRequest.DONE) {
//     return xhr.response;
//   }
// }
// xhr.open("GET", url);
// xhr.send();

// USING fetch
// fetch(endpoint, {cache: 'no-cache'})
// 	.then(response => {
//     	if (response.ok) {
//      		return response.json();
//     	}
//     	throw new Error('Request failed!');
// 	}, networkError => {
// 		console.log(networkError.message)
//   	}).then((jsonResponse) => {
//     renderResponse(jsonResponse);
// 	})

// ASYNC FETCH GET BOILER
// const getData = async () => {
// 	try {
// 	  const response = await fetch("https://api-to-call.com/endpoint");
// 	  if (response.ok) {
// 		const jsonResponse = await response.json();
// 		return jsonResponse;
// 	  }
// 	  throw new Error("Request failed!");
// 	} catch(error) {
// 	  console.log(error);
// 	}
//   };

// ASYNC FETCH POST EXAMPLE
// const shortenUrl = async () =>{
// 	const urlToShorten = inputField.value;
// 	const data = JSON.stringify({destination: urlToShorten});

// 	try{
// 	  const response =  await fetch(rebrandlyEndpoint, {
// 		method: 'POST',
// 		body: data,
// 		headers: {
// 		  "Content-type": "application/json",
// 		  'apikey': apiKey
// 		}
// 	  })
// 	  if(response.ok){
// 		const jsonResponse = await response.json();
// 			  renderByteResponse(jsonResponse);
// 	  }
// 	}
// 	catch(error){
// 	  console.log(error);
// 	}
//   }
