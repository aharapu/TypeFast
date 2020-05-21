// Get the modal
const modal = document.getElementById("modal");
// Get the buttons that opens the modal
const highScoresBtn = document.getElementById("high-scores");
const howToButton = document.getElementById("howTo-button");
// Get handlebarsjs templates
const highScoreTemplate = document.getElementById("high-score-template").innerHTML;
const howToTemplate = document.getElementById("howTo-template").innerHTML;
// Handlebars helper
Handlebars.registerHelper("incremented", function (index) {
	index++;
	return index;
});

const highScoreData = {
	players: [
		{
			score_id: 1,
			place: 1,
			name: "Vasilescu Vasile",
			score: 2345,
		},
		{
			score_id: 2,
			place: 2,
			name: "Mihalache Vasile",
			score: 2345,
		},
		{
			score_id: 3,
			place: 3,
			name: "Vasilescu Grosu",
			score: 2345,
		},
		{
			score_id: 4,
			place: 4,
			name: "John John",
			score: 2345,
		},
		{
			score_id: 5,
			place: 5,
			name: "Terminator",
			score: 2345,
		},
		{
			score_id: 6,
			place: 6,
			name: "R3al Name Vasile",
			score: 2345,
		},
		{
			score_id: 7,
			place: 7,
			name: "BIGDINK",
			score: 2345,
		},
	],
};
const howToData = {
	howToInfo:
		"You will get one sentence at a time. Simply type the sentence in the box below as fast as humanly possible. Make sure you get the right capitalization and all the symbols in the right place. This is harder than it seems! You start with 30 seconds. Each correct submission gives you extra time. The longer the sentence typed, the more time you gain.",
};

highScoresBtn.addEventListener("click", () => {
	generateModal(highScoreTemplate, highScoreData);
});
howToButton.addEventListener("click", () => {
	generateModal(howToTemplate, howToData);
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
