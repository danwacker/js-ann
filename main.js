
const epochs = 5;
const rounds = 100000;
const trainingtype = 'blind learn';
const neworload = 'load network';


const board = document.getElementById("gameCanvas");
const canv = board.getContext("2d");

let commandlist = [];
commandlist.unshift(neworload);
for (let j=0; j<epochs; j++) {
for (let i=0; i<rounds; i++) {
    commandlist.unshift(trainingtype);
}
commandlist.unshift('save network');
}

let xhttp = new XMLHttpRequest();
xhttp.open(
    'POST',
    'SnakePage.html',
    true
);
xhttp.setRequestHeader('Content-Type','text/plain')
xhttp.send(JSON.stringify(commandlist));
 