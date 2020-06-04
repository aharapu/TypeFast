// Get the modal
const modal = document.getElementById("modal");
const submitSentenceModal = document.getElementById("submitSentenceModal");
// Get the buttons that opens the modal
const highScoresBtn = document.getElementById("high-scores");
const howToButton = document.getElementById("howTo-button");
// Get imput to submit sentence
const sentenceInputField = document.getElementById("newSentence");
// Get handnebarsjs templates
const highScoreTemplate = document.getElementById("high-score-template").innerHTML;
const howToTemplate = document.getElementById("howTo-template").innerHTML;
// Handlebars helper
Handlebars.registerHelper("incremented", function (index) {
	index++;
	return index;
});

getHighScoreData();

const howToData = {
	howTo1:
		"You will get one sentence at a time. Simply type the sentence in the box below as fast as humanly possible.",
	howTo2:
		"Make sure you get the right capitalization and all the symbols in the right place. This is harder than it seems!",
	howTo3:
		"You start with 30 seconds. Each correct submission gives you extra time. The longer the sentence typed, the more time you gain.",
};

highScoresBtn.addEventListener("click", () => {
	generateModal(highScoreTemplate, highScoreData);
});
howToButton.addEventListener("click", () => {
	generateModal(howToTemplate, howToData);
});

sentenceInputField.addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		const sentenceToAdd = e.target.value;
		console.log("submitting sentence:", sentenceToAdd);
		postNewSentence(sentenceToAdd);
		submitSentenceModal.style.display = "none";
	}
});

function generateModal(template, contextData) {
	let contextGenerator = Handlebars.compile(template);
	let html = contextGenerator(contextData);
	document.getElementById("handlebars-container").innerHTML = html;
	modal.style.display = "block";
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}

//the close button
const closeBtn = document.getElementById("close");
closeBtn.onclick = function () {
	modal.style.display = "none";
};
