/*jshint esversion: 6*/

const express = require("express");
const app = express();
/*const axios = require("axios");
const cheerio = require("cheerio");*/
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + "/public"));


app.get("/", (req, res) => {
    res.redirect("/playgame");

});



const getroomID = () => {
    let _id = "";
    for (let i = 0; i < 8; i++) {
        _id = _id + "" + Math.floor(Math.random() * 10);
    }
    return _id.substr(0, 4) + "." + _id.substr(4);
};

const broadcastCellPicks = (socket, status, data) => {
    let srch = searchSocket(data.id);
    if (srch) {
        socket.broadcast.to(srch.players[0].sock).emit('player2CellPicked', { state: status, cell: data.cell });
    }
};

const searchSocket = (idval) => {
    let rooms = io.sockets.mygameRooms;
    for (let rm in rooms) {
        if (rooms[rm].id == idval) {
            return rooms[rm];
        }
    }
    return false;

};

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('createRoom', function(data) {
        console.log("Creating for: " + data.player1);

        let obj = {
            id: getroomID(),
            players: [{ sock: socket.id, name: data.player1 }]
        };


        if (io.sockets.mygameRooms) {
            if (data.preserveReload) {
                let srch = searchSocket(data.id);
                if (srch && srch.players[0].name == data.player1) {
                    srch.players[0].sock = socket.id;
                    srch.preserveReload = false;
                    socket.emit("roomcreated", { player: data.player1, id: data.id });
                }

            } else {
                io.sockets.mygameRooms.push(obj);
                socket.emit("roomcreated", { player: data.player1, id: obj.id });
            }
            console.log("Pushed data into io.sockets array");

        } else {
            let rooms = [];
            rooms.push(obj);
            io.sockets.mygameRooms = rooms;
            console.log("created New rooms array in io.sockets");
            socket.emit("roomcreated", { player: data.player1, id: obj.id });
        }


        //broadcast to everyone except this socket
        //socket.broadcast.emit('hi');
    });

    socket.on('joinRoom', function(data) {
        console.log("Joining for: " + data.player2);
        let acceptID = data.id;
        if (acceptID.length == 9 && acceptID.includes(".")) {
            let id = acceptID.split(".");
            if (id.length == 2 && id[0].length == 4 && id[1].length == 4) {
                let srch = searchSocket(acceptID);
                if (srch) {
                    let ply = srch.players;
                    let plName = data.player2.toLowerCase();
                    if ((!srch.preserveReload && ply.length == 1) || (srch.preserveReload && ply.length == 2)) {
                        if (ply[0].name != plName) {
                            if (srch.preserveReload) {
                                console.log("joining room preserve reload");
                                srch.players[1].sock = socket.id;
                                srch.preserveReload = false;
                            } else {
                                srch.players.push({ sock: socket.id, name: plName });
                            }

                            let isPuzzle = srch.puzzler ? JSON.parse(JSON.stringify(srch.puzzler)) : false;
                            if (srch.puzzler) { srch.puzzler = { set: false }; }

                            socket.emit('joined', { players: srch.players, id: acceptID, cells: srch.cellPoints, puzzler: isPuzzle });
                            socket.broadcast.to(srch.players[0].sock).emit('player2in', { players: srch.players, id: acceptID });

                        } else {
                            socket.emit('duplicateName', "");
                        }
                    } else if (ply.length > 1) {
                        socket.emit('playerfull', "");
                    } else {
                        socket.emit('noplayer', "");
                    }
                } else {
                    console.log('ID not found');
                    socket.emit('errorID', { error: "ID not found", rooms: io.sockets.mygameRooms });
                }

            } else {
                socket.emit('errorID', "You entered an Invalid ID");
            }
        } else {
            socket.emit('errorID', "You entered an Invalid ID");
        }

    });

    socket.on('cellsPicked', function(data) {
        let srch = searchSocket(data.id);
        if (srch) {
            srch.cellPoints = data.cells;
            if (data.puzz.set) {
                srch.puzzler = data.puzz;
            }
            if (data.preserve) {
                srch.preserveReload = true;
                socket.broadcast.to(srch.players[1].sock).emit('Player2Refresh', '');
            }
        }

    });



    socket.on('correctPick', function(data) {
        broadcastCellPicks(socket, "correct", data);
    });
    socket.on('wrongPick', function(data) {
        broadcastCellPicks(socket, "wrong", data);
    });
    socket.on('bombPick', function(data) {
        broadcastCellPicks(socket, "bomb", data);
    });

    socket.on('puzzleBombClear', function(data) {
        let srch = searchSocket(data.id);
        if (srch) {
            socket.broadcast.to(srch.players[0].sock).emit('puzzBombCleared', '');
        }
    });

    socket.on('puzzleFailed', function(data) {
        let srch = searchSocket(data.id);
        if (srch) {
            socket.broadcast.to(srch.players[0].sock).emit('p2PuzzleFailed', '');
        }
    });


    socket.on('reqestChallenge', function(data) {
        let srch = searchSocket(data.id);
        if (srch) {
            socket.broadcast.to(srch.players[0].sock).emit('ChlngReqFromPlayer2', { id: srch.id });
        }
    });

    socket.on('acceptRequest', function(data) {
        let srch = searchSocket(data.id);
        if (srch) {
            if (srch.players.length == 2) {
                srch.preserveReload = true;
                console.log("preserve set to TRUE");
                socket.broadcast.to(srch.players[1].sock).emit('replayReqAccepted', { id: srch.id, players: srch.players });
            }
        }
    });

    socket.on('getWord', function(data) {
        console.log('word pick....');
        let words = "ability absence academy account accused achieve acquire address advance adviser airline airport alcohol analyst ancient anxious anxiety article assault attract auction average banking balance battery bedroom believe benefit billion brother cabinet captain capital careful caption capture carrier caution ceiling century central chapter charity chicken circuit classic climate collect clothes combine comfort college command comment compact compete compare company concept confirm concert connect content contact control council correct convert country counter crystal culture current decline default deliver defence desktop density destroy develop diamond discuss disease display distant driving drawing dynamic eastern economy element enhance essence evening examine example explain explore express factory extreme failure fashion fiction fifteen finance fishing forever foreign fitness formula fortune forward founder freedom general gateway gallery genetic genuine greater healthy helpful highway himself history housing holiday hundred husband illegal illness imagine include improve inquiry insight install instant involve intense journey justice kitchen kingdom liberty library license machine manager married maximum meaning meeting medical measure message million mineral minimum mistake mission mistake monthly monitor morning musical mystery natural nervous neutral network nuclear nothing nursing obvious offense nursing officer opening operate opinion optical outdoor organic outcome overall outside outlook package pacific partner parking passion patient pattern payment percent pension perform perfect picture pioneer plastic poverty popular precise predict premium prepare present primary printer privacy private problem process profile program product project promise protect protein protest publish quality qualify railway quarter respect restore satisfy science serious section silence speaker special station website welcome western welcome vehicle village uniform";
        let wordlist = words.split(" ");
        let word = wordlist[Math.floor(Math.random() * wordlist.length)];
        console.log(word);
        if (data.player == "two") {
            let srch = searchSocket(data.id);
            if (srch) {
                socket.broadcast.to(srch.players[0].sock).emit('p2PuzzPlay', { player: srch.players[0].name });
            }

        } else {
            socket.emit("wordPicked", { word: word.toUpperCase() });
        }

    });


    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.id);
        socket.broadcast.emit('disconnected', { id: socket.id });
        if (io.sockets.mygameRooms) {
            let rooms = io.sockets.mygameRooms;
            let searched = false;
            for (let rm in rooms) {
                for (let sid in rooms[rm].players) {
                    if (socket.id == rooms[rm].players[sid].sock) {
                        if (rooms[rm].preserveReload) {
                            console.log("preserved disconnect....");
                            searched = true;
                            break;
                        } else if (rooms[rm].players.length == 2) {
                            let theOther = 0;
                            theOther = sid == 0 ? 1 : 0;
                            socket.broadcast.to(rooms[rm].players[theOther].sock).emit('playergone', { name: rooms[rm].players[sid].name, id: rooms[rm].id });
                            io.sockets.mygameRooms[rm].players.splice(sid, 1);
                        } else {
                            io.sockets.mygameRooms.splice(rm, 1);
                        }

                        searched = true;
                    }
                }
                if (searched) {
                    break;
                }
            }
        }

    });
});

//io.emit('some event', { for: 'everyone' });



app.get("/playgame", (req, res) => {
    res.sendFile(__dirname + "/public/game.html");

});



app.get('/*', (req, res) => {
    res.redirect('/error.html');

});

http.listen(port, () => {
    console.log(`Server running at port ` + port);
});