const board = document.getElementById("gameCanvas");
const canv = board.getContext("2d");
const params = {
    epochs : 100,
    rounds : 1000,
    action : 'train',
    load : false
};

let xhttp = new XMLHttpRequest();
xhttp.open(
    'POST',
    'SnakePage.html',
    true
);
xhttp.setRequestHeader('Content-Type','text/plain')
xhttp.send(JSON.stringify(params));
 