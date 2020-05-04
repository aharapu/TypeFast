// CONNECTIONS TO HTML ELEMENTS
const testSentence = document.getElementById("test-sentence");
const inputString = document.getElementById("input-string");
const currentResult = document.getElementById("current-result");
const currentSentenceElement = document.getElementById("current-sentence");
const timeBar = document.getElementById("time-bar");
const startButton = document.getElementById("start-button");
const howToButton = document.getElementById("howTo-button");
const noobModeButton = document.getElementById("noob-mode");
const normalModeButton = document.getElementById("normal-mode");
const beastModeButton = document.getElementById("beast-mode");
const greenSentenceH2 = document.getElementById("first-part");

const GET_REQ_URL = "http://localhost:8080/getSentencesDB/getSentence";
const PUT_REQ_URL = "http://localhost:8080/getSentencesDB/add";
const HOW_TO_INSTR =
	"You will get one sentence at a time. Simply type the sentence in the box below as fast as humanly possible. Make sure you get the right capitalization and all the symbols in the right place. This is harder than it seems! You start with 30 seconds. Each correct submission gives you extra time. The longer the sentence typed, the more time you gain.";

startButton.addEventListener("click", startGame);
howToButton.addEventListener("click", howTo);
noobModeButton.addEventListener("click", setNoobMode);
normalModeButton.addEventListener("click", setNormalMode);
beastModeButton.addEventListener("click", setBeastMode);

let currentSentence = String(currentSentenceElement.innerHTML);
let nextSentence = "The second sentence is always the same."; // fix this whe api is done
let timeOver = false;
let gameIsRunning = false;
let score = 0;

// SHOW HOW TO
function howTo() {
	alert(HOW_TO_INSTR);
}

// CHANGE DIFFICULTY
function setNoobMode() {
	noobModeButton.style.opacity = "1";
	normalModeButton.style.opacity = "0.7";
	beastModeButton.style.opacity = "0.7";
	inputString.setAttribute("type", "string");
	compareSentencesLive("on");
}
function setNormalMode() {
	noobModeButton.style.opacity = "0.7";
	normalModeButton.style.opacity = "1";
	beastModeButton.style.opacity = "0.7";
	inputString.setAttribute("type", "string");
	compareSentencesLive("off");
}
function setBeastMode() {
	noobModeButton.style.opacity = "0.7";
	normalModeButton.style.opacity = "0.7";
	beastModeButton.style.opacity = "1";
	inputString.setAttribute("type", "password");
	compareSentencesLive("off");
}

// GAME INITIALIZATION
function startGame() {
	startButton.innerHTML = "Type as fast as you can!";
	startButton.style.cursor = "not-allowed";
	startButton.style.opacity = "0.7";
	$("#input-string").focus();
	turnTimerOn();
	gameIsRunning = true;
	timeBar.value = "30";
	score = 0;
}

// COUNTDOWN TIMER
function turnTimerOn() {
	let x = setInterval(function () {
		timeBar.value -= 1;
		if (timeBar.value <= 0) {
			clearInterval(x);
			currentResult.innerHTML = "TIME OUT, YOU LOST, LOSER, GO HOME!";
			alert("game over");

			// add new sentence into DB via API call
			const dataAddedSentence = prompt(
				"Please enter a new sentence to practice in the future:",
				"New Sentence"
			);
			$.ajax({
				url: PUT_REQ_URL,
				method: "POST", // method is any HTTP method
				contentType: "text/plain",
				data: dataAddedSentence,
				success: function () {
					alert("new sentence added");
				},
			});
			gameIsRunning = false;
			startButton.innerHTML = "TRY AGAIN!";
			startButton.style.cursor = "";
			startButton.style.opacity = "1";
		}
	}, 1000);
}

// ENTER SENTENCE LISTENER
inputString.addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		const enteredSentence = String(inputString.value);
		inputString.value = ""; // clearing the text after keypress
		if (enteredSentence === currentSentence) {
			timeBar.value += enteredSentence.length / 4;
			currentResult.innerHTML = "Good job, try another one!";
			score += enteredSentence.length;
		} else {
			currentResult.innerHTML = "You wasted time, try another sentence!";
		}
		currentSentence = nextSentence;
		currentSentence.innerHTML = currentSentence;
		httpGetAsync(GET_REQ_URL, setNextSentence); // api call here
	}
});

// STRING COMPARING FOR NOOB MODE
function compareSentencesLive(onOff) {
	if (onOff === "on") {
		inputString.addEventListener("keyup", makeGreen);
	} else {
		inputString.removeEventListener("keyup", makeGreen);
		greenSentenceH2.innerHTML = "";
		currentSentenceElement.innerHTML = currentSentence;
	}
}

function makeGreen (e) {
	// let sentenceToCheckWith = String(currentSentence.innerHTML);
	const enteredSentence = String(inputString.value);
	let sLength = enteredSentence.length;

	// greenSentenceH2.innerHTML = sentenceToCheckWith.substring(0,howLong);
	if (sLength <= currentSentence.length && enteredSentence == currentSentence.substring(0,sLength)) {
		greenSentenceH2.innerHTML = enteredSentence;
		currentSentenceElement.innerHTML = currentSentence.substring(sLength);
	}
	
}

// API call function to get a new sentence and place it into nextSentence
function httpGetAsync(url, callback) {
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	};
	xmlHttp.open("GET", url, true); // true for asynchronous
	xmlHttp.send(null);
}

function setNextSentence(responseSentence) {
	nextSentence = responseSentence;
}
