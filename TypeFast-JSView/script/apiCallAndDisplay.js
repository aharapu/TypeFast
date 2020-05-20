// TO DO - creat api that calls sql db and reads a json with the leaderboard

const leaderboard = { players:[
    {
        score_id: 1,
        place: 1,
        name: "Vasilescu Vasile",
        score: 2345
    },
    {
        score_id: 2,
        place: 2,
        name: "Mihalache Vasile",
        score: 2345
    },
    {
        score_id: 3,
        place: 3,
        name: "Vasilescu Grosu",
        score: 2345
    },
    {
        score_id: 4,
        place: 4,
        name: "John John",
        score: 2345
    },
    {
        score_id: 5,
        place: 5,
        name: "Terminator",
        score: 2345
    },
    {
        score_id: 6,
        place: 6,
        name: "R3al Name Vasile",
        score: 2345
    },
    {
        score_id: 7,
        place: 7,
        name: "BIGDINK",
        score: 2345
    },
]};

var source = document.getElementById("leaderboard-template").innerHTML;

Handlebars.registerHelper('incremented', function (index) {
    index++;
    return index;
});
var template = Handlebars.compile(source);

// var context = { title: "TItlul asta", body: "post facut cu handlebars!" };
let context = leaderboard;

var html = template(context);

document.getElementById("handlebars-leaderboard-container").innerHTML = html;