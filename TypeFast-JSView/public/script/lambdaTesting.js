// getting sentences using lambdas
const ListElement = document.querySelector('#sentence-list');
const GetSentencesBtn = document.querySelector('#get-sentences-btn');

GetSentencesBtn.addEventListener('click', displaySentences);

async function displaySentences() {
	const sentences = await getSentences();
	console.log(sentences);
	sentences.forEach(({ sentence }) => {
		const child = ListElement.appendChild(document.createElement('li'));
		child.innerText = sentence;
	});
}

// posting a sentence using lambdas
const PostSentenceBtn = document.querySelector('#send-sentence-button');
const SentenceInput = document.querySelector('#sentence-input');

PostSentenceBtn.addEventListener('click', sendSentence);

async function sendSentence() {
	try {
		const sentence = SentenceInput.value;
		SentenceInput.value = '';
		const response = await postSentence(sentence);
		alert(response);
	} catch (err) {
		console.error(err);
	}
}
