const express = require("express");
const morgan = require('morgan');
const cors = require('cors')
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');


app.use(morgan("dev"));
app.use(cors());
// creating and assigning a router
const highScoreRouter = express.Router();
const sentenceRouter = express.Router();
app.use("/highScores", highScoreRouter);
app.use("/sentences", sentenceRouter);


// request handling with a router
highScoreRouter.get("/", (req, res, next) => {
	const highScore = require("./highScores.json");
	res.status(200).json(highScore);
});

sentenceRouter.get("/", (req, res, next) => {
	const sentences = require("./sentences.json");
	res.status(200).json(sentences);
});

sentenceRouter.post("/", bodyParser.json(), (req, res, next) => {
	const newSentence = req.body;
	const pendingSentences = require("./pendingSentences.json");
	console.log(" new sentence obj looks like ", newSentence);
	pendingSentences.array.push(newSentence);
	const pendingSentencesAsData = JSON.stringify(pendingSentences);
	fs.writeFileSync('./pendingSentences.json', pendingSentencesAsData);
	res.status(201).send(newSentence);
});

app.post("/expressions", (req, res, next) => {
	const receivedExpression = createElement("expressions", req.query);
	if (receivedExpression) {
		expressions.push(receivedExpression);
		res.status(201).send(receivedExpression);
	} else {
		res.status(400).send();
	}
});

const PORT = 4001;





// Use static server to serve the Express Yourself Website
// app.use(express.static("public"));

/* app.get("/expressions", (req, res, next) => {
	res.send(expressions);
});

app.get("/animals", (req, res, next) => {
	res.send(animals);
});

app.get("/expressions/:id", (req, res, next) => {
	const foundExpression = getElementById(req.params.id, expressions);
	if (foundExpression) {
		res.send(foundExpression);
	} else {
		res.status(404).send();
	}
});

app.put("/expressions/:id", (req, res, next) => {
	const expressionIndex = getIndexById(req.params.id, expressions);
	if (expressionIndex !== -1) {
		updateElement(req.params.id, req.query, expressions);
		res.send(expressions[expressionIndex]);
	} else {
		res.status(404).send();
	}
});

app.post("/expressions", (req, res, next) => {
	const receivedExpression = createElement("expressions", req.query);
	if (receivedExpression) {
		expressions.push(receivedExpression);
		res.status(201).send(receivedExpression);
	} else {
		res.status(400).send();
	}
});

app.delete("/expressions/:id", (req, res, next) => {
	const expressionIndex = getIndexById(req.params.id, expressions);
	if (expressionIndex !== -1) {
		expressions.splice(expressionIndex, 1);
		res.status(204).send();
	} else {
		res.status(404).send();
	}
}); */

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
