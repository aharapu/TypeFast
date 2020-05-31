// CONNECTIONS TO HTML ELEMENTS
const testSentence = document.getElementById("test-sentence");
const inputString = document.getElementById("input-string");
const currentResult = document.getElementById("current-result");
const currentSentenceElement = document.getElementById("current-sentence");
const progressBar = document.getElementById("progress-bar");
const startButton = document.getElementById("start-button");
const noobModeButton = document.getElementById("noob-mode");
const normalModeButton = document.getElementById("normal-mode");
const beastModeButton = document.getElementById("beast-mode");
const greenSentenceH2 = document.getElementById("first-part");
const popUpContainer = document.getElementById("popUpContainer");

const GET_REQ_URL = "http://localhost:8080/getSentencesDB/getSentence";
const PUT_REQ_URL = "http://localhost:8080/getSentencesDB/add";

startButton.addEventListener("click", startGame);
noobModeButton.addEventListener("click", ()=> {setMode("noob")});
normalModeButton.addEventListener("click", ()=> {setMode("normal")});
beastModeButton.addEventListener("click", ()=> {setMode("beast")});

let currentSentence = String(currentSentenceElement.innerText);
let nextSentence = "The second sentence is always the same."; // fix this when api is done
let timeOver = false;
let gameIsRunning = false;
let score = 0;
let secondsLeft = 0;
let isModeSelected = false;

// CHANGE DIFFICULTY
function setMode(modeSlection) {
	document.querySelectorAll(".modeButton").forEach(nodeElement => nodeElement.style.opacity="0.5");
	document.querySelector(`#${modeSlection}-mode`).style.opacity="1";
	isModeSelected = true;
	inputString.setAttribute("type", modeSlection!=="beast"?"string":"password");
	compareSentencesLive(modeSlection!=="noob"?"off":"on");
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
	turnTimerOn();
	gameIsRunning = true;
	secondsLeft = 30;
	score = 0;
}

// COUNTDOWN TIMER
function turnTimerOn() {
	let x = setInterval(function () {		
		secondsLeft--
		const secondsInPercentage = secondsLeft / 30 * 100;
		progressBar.style.width = `${secondsInPercentage}%`;
		progressBar.innerText = `${secondsLeft}s`;
		switch (true) {
			case (secondsLeft < 6) : progressBar.style.backgroundColor = "rgb(49, 34, 0)";
				break;
			case (secondsLeft < 11) : progressBar.style.backgroundColor = "rgb(112, 84, 20)";
				break;
			default: progressBar.style.backgroundColor = "rgb(179, 125, 73)";
		}
		
		if (secondsLeft <= 0) {			// GAME OVER condition is met
			clearInterval(x);
			currentResult.innerText = "You ran out of time. Hit \"Try again!\" for a new game.";
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
			startButton.innerHTML = "Try again!";
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
			sayGoodJob();
			secondsLeft += Math.floor(enteredSentence.length / 4);
			currentResult.innerHTML = "Good job, try another one!";
			score += enteredSentence.length;
		} else {
			currentResult.innerHTML = "You wasted time, try another sentence!";
		}
		currentSentence = nextSentence;
		currentSentenceElement.innerHTML = currentSentence;
		httpGetAsync(GET_REQ_URL, setNextSentence); // api call here
	}
});

// STRING COMPARING FOR NOOB MODE
// console.log('Hey'.startsWith('H')); // Prints true  <-- somthing to use?
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

function makeGreen () {  	// WEIRD SHIT GOING ON, NEEDS REFACTORING. use css ::before and ::after
	const enteredSentence = String(inputString.value);
	console.log(enteredSentence);
	let sLength = enteredSentence.length;
	if (sLength <= currentSentence.length && enteredSentence == currentSentence.substring(0,sLength)) {
		greenSentenceH2.innerText = enteredSentence;
		currentSentenceElement.innerText = currentSentence.substring(sLength);
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

// Good job Pop-ups

function sayGoodJob() {
	
		popUpContainer.classList.toggle("showPopUp");
		setTimeout(() => {
		  popUpContainer.classList.toggle("showPopUp");
		}, 300);
	  
}


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