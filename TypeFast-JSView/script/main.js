// CONNECTIONS TO HTML ELEMENTS
// buttons
const startButton = document.getElementById('start-button');
const noobModeButton = document.getElementById('noob-mode');
const normalModeButton = document.getElementById('normal-mode');
const beastModeButton = document.getElementById('beast-mode');

//game logic
const greenSentenceH2 = document.getElementById('first-part');
const popUpContainer = document.getElementById('popUpContainer');
const testSentence = document.getElementById('test-sentence');
const inputString = document.getElementById('input-string');
const currentResult = document.getElementById('current-result');
const currentSentenceElement = document.getElementById('current-sentence');
const progressBar = document.getElementById('progress-bar');
const GET_REQ_URL = 'http://localhost:8080/getSentencesDB/getSentence';
const PUT_REQ_URL = 'http://localhost:8080/getSentencesDB/add';

startButton.addEventListener('click', startGame);
noobModeButton.addEventListener('click', () => {
	setMode('noob');
});
normalModeButton.addEventListener('click', () => {
	setMode('normal');
});
beastModeButton.addEventListener('click', () => {
	setMode('beast');
});

// game logic initialization
let streak = 0;
let level = 1;
let correctSentenceCount = 0;
let timeOver = false;
let gameIsRunning = false;
let score = 0;
let secondsLeft = 30;
let isModeSelected = false;
let computedStyle = window.getComputedStyle(progressBar);
let initialWidth = parseFloat(computedStyle.getPropertyValue('width')); // get initial width reference

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
		.querySelectorAll('.modeButton')
		.forEach((nodeElement) => (nodeElement.style.opacity = '0.5'));
	document.querySelector(`#${modeSlection}-mode`).style.opacity = '1';
	isModeSelected = true;
	inputString.setAttribute('type', modeSlection !== 'beast' ? 'string' : 'password');
	compareSentencesLive(modeSlection !== 'noob' ? 'off' : 'on');
}

// GAME INITIALIZATION
function startGame() {
	gameIsRunning = true;
	score = 0;
	streak = 0;
	correctSentenceCount = 0;
	if (!isModeSelected) {
		setMode('normal');
	}

	// activate and focus on input area
	inputString.style.pointerEvents = 'auto';
	inputString.focus();
	// deactivate buttons during gameplay
	toggleButtonActiveInactive(startButton, 'Type as fast as you can!');
	toggleButtonActiveInactive(highScoresBtn);
	toggleButtonActiveInactive(howToButton);
	// reset and activate progress bar
	progressBar.setAttribute('style', 'width: ' + initialWidth + 'px');
	setTimeout(() => {
		progressBar.setAttribute('style', 'width:0px !important; transition: width 30s linear;');
	}, 20);
	progressBar.innerText = '30s';

	//check for loss condition and display time left.
	const checkEndGameInterval = setInterval(() => {
		displayTimeLeft();

		switch (true) {
			case secondsLeft < 0.1:
				gameIsRunning = false;
				// freeze time bar
				progressBar.setAttribute('style', 'width:3px !important; color: black;');
				progressBar.innerText = 'Time is up!';
				clearInterval(checkEndGameInterval);
				toggleButtonActiveInactive(startButton, 'Try again!');
				toggleButtonActiveInactive(highScoresBtn);
				toggleButtonActiveInactive(howToButton);
				// reveal add new sentence modal and focus input
				submitSentenceModal.style.display = 'block';
				sentenceInputField.focus();
				// deactivate input area
				inputString.value = ''
				inputString.style.pointerEvents = 'none';
				// reset first sentence
				currentSentence = 'Type this first.';
				currentSentenceElement.innerHTML = currentSentence;
				break;
			case secondsLeft < 10:
				progressBar.style.backgroundColor = 'rgb(49, 34, 0)';
				break;
			case secondsLeft < 20:
				progressBar.style.backgroundColor = 'rgb(112, 84, 20)';
				break;
			default:
				progressBar.style.backgroundColor = 'rgb(179, 125, 73)';
		}
	}, 1000);
}

// ENTER SENTENCE LISTENER
inputString.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		const enteredSentence = String(inputString.value);
		inputString.value = ''; // clearing the text after keypress
		if (enteredSentence === currentSentence) {
			// adjust progress bar
			let timeToAdd = Math.max( (enteredSentence.length / 4) - (correctSentenceCount / 10), 0);
			let timeInPixels = (initialWidth * timeToAdd) / 30;
			let computedStyle = window.getComputedStyle(progressBar);
			let width = parseFloat(computedStyle.getPropertyValue('width'));
			let newWidth = Math.min(timeInPixels + width, initialWidth);
			progressBar.setAttribute('style', 'width: ' + newWidth + 'px');
			// adjust score, streak and level
			score += enteredSentence.length;
			streak += 1;
			correctSentenceCount += 1;
			sayGoodJob();

			// timeout is a rendering workaround to trigger the transition correctly
			setTimeout(() => {
				let newWidthInSeconds = (30 * newWidth) / initialWidth;
				progressBar.setAttribute(
					'style',
					'width:0px !important; transition: width ' + newWidthInSeconds + 's linear;',
				);
			}, 20);

			currentResult.innerHTML = 'Good job, try another one!';
		} else {
			currentResult.innerHTML = 'You wasted time, try another sentence!';
			streak = 0;
		}
		currentSentence = nextSentence;
		currentSentenceElement.innerHTML = currentSentence;
		nextSentence = assignRandomSentence();
	}
});

// HELPER FUNCTIONS

function toggleButtonActiveInactive(button, buttonText = '') {
	if (buttonText) button.innerText = buttonText;
	if (button.style.pointerEvents === 'none') {
		button.style.cursor = '';
		button.style.pointerEvents = 'auto';
		button.style.opacity = '1';
	} else {
		button.style.cursor = 'not-allowed';
		button.style.pointerEvents = 'none';
		button.style.opacity = '0.5';
	}
}

// STRING COMPARING FOR NOOB MODE
// TO DO -> console.log('Hey'.startsWith('H')); // Prints true  <-- somthing to use?
function compareSentencesLive(onOff) {
	if (onOff === 'on') {
		inputString.addEventListener('keyup', makeGreen);
		makeGreen();
	} else {
		inputString.removeEventListener('keyup', makeGreen);
		greenSentenceH2.innerText = '';
		currentSentenceElement.innerText = currentSentence;
	}
}

function makeGreen() {
	// TO DO -> WEIRD SHIT GOING ON, NEEDS REFACTORING. use css ::before and ::after ?
	const enteredSentence = String(inputString.value);
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
	return sentenceData.array[randomIndex].sentence;
}

// Good job Pop-ups
popUpTextArray = ['YaaaaS!', 'GOOD JOB!', 'Keep going!', 'ONE MORE!', 'Boom Baby!', 'LOVE IT!'];
function sayGoodJob() {
	if (correctSentenceCount % 10 === 0) {
		document.querySelector('#popUpText').innerHTML = `LEVEL ${correctSentenceCount / 10 + 1}`;
	} else if (streak % 5 === 0) {
		document.querySelector('#popUpText').innerHTML = `${streak} STREAK!`;
	} else {
		const randOption = Math.floor(Math.random() * 6);
		document.querySelector('#popUpText').innerHTML = popUpTextArray[randOption];
	}

	popUpContainer.classList.toggle('showPopUp');
	setTimeout(() => {
		popUpContainer.classList.toggle('showPopUp');
	}, 400);
}

function displayTimeLeft() {
	const computedStyle = window.getComputedStyle(progressBar);
	const currentWidth = parseFloat(computedStyle.getPropertyValue('width'));
	secondsLeft = Math.floor((currentWidth * 30) / initialWidth);
	progressBar.innerText = `${secondsLeft}s`;
}

function endGame(interval) {}
