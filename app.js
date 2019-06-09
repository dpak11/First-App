const express = require("express");
const app = express();
/*const axios = require("axios");
const cheerio = require("cheerio");*/
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + "/public"));


app.get("/", (req, res) => {
    console.log("main page >> " + __dirname);
    res.sendFile(__dirname + "/public/main.html");

});
app.get("/api/names", (req, res) => {
    console.log("names api call... ");
    const g_names = "UHJpeWEsIFRhbnlhLCBQcml5YW5rYSwgRGl2eWEsIFRhbnZpLCBJc2hpdGEsIFZhbmksIEFuamFsaSwgU2hyZXlhLCBSaXlhLCBTbmVoYSwgQWlzaHdhcnlhLCBHYXlhdHJpLCBWYXJzaGEsIElyYSwgU2FuamFuYSwgTmloYXJpa2EsIE5pa2l0YSwgTmF0YXNoYSwgTmVoYSwgU2hpdmFuZ2ksIFJhbXlhLCBJc2hhLCBBbmFueWEsIFNoaXZhbmksIFNha3NoaSwgQXN3aW5pLCBTdWhhbmksIExlYWgsIFBhdml0aHJhLCBTZWVtYSwgQW51c2hhLCBTaW1yYW4sIE5pc2hpLCBBbnVzaHJpLCBBeXVzaGksIFJhZGhpa2EsIFRhbnUsIEtyaXRoaWthLCBBbmlzaGEsIEFrYW5zaGEsIFNhZGFmLCBOaXNoaXRhLCBEaXlhLCBTaXlhLCBBYmlnYWlsLCBLYWx5YW5pLCBSaXNoaXRhLCBBYXN0aGEsIE1hcnksIFNhcmEsIFByYWNoaSwgSW5kaHVtYXRoaSwgU2hyaW5pZGhpLCBQYXB1aWkgY29sbmV5LCBSaGVhLCBLYXRoZXJpbmUsIFJ1dHVqYSwgQXJ0aSwgRGViYmllLCBDcm93bnksIE1hbmlzaGEsIE1haGltYSwgQWRpdGksIEFhc2huYSwgVGlzaGEsIE1vaWkgY2hoYW5ndGUsIFNhbSwgU3dhdGksIERpYSwgUmlhLCBBbnUsIE5lZWxhbSwgTi5Qcml5YW5rYSwgTklTSEEsIENoYW5kcmFsZWtoYSwgTWl0YWxpLCBEYXduLCBEaWxtaW5pLCBLYW1hbGlrYSwgS2h1c2hpLCBBbmphbmEsIEFyeWEsIERlZXBhLCBKdXZpbmEsIEFuZ2VsLCBBbmFtaWthLCBMYXZhbnlhLCBJc2hpa2EsIExpbHksIEFyY2hpdGEsIFJhc2hpLCBTYXJhaCwgU2FzYXNoeSwgVmFpc2huYXZpLCBEaWtzaGEsIEFydXNoYSwgTml0aSwgVmlkaHlhLCBLYXZ5YSwgQWJoYSwgQWJoaWxhc2hhLCBBZGhpdGEsIEFkaXRhLCBBa2Fua3NoYSwgQW1hbGEsIEFtYsOiLCBBbWl0YSwgQW1yaXRhLCBBbmFuZGEsIEFuYW5kaSwgQW5hbmRpdGEsIEFuYW50YSwgQW5hbnRlZSwgQW5hbnRoYSwgQW5pbGEsIEFuaW1hLCBBbmtpdGEsIEFudHJpamEsIEFudWphLCBBbnVwYW1hLCBBcGFyYWppdGEsIEFwcGFzc2FteSwgQXJhZGhhbmEsIEFyY2hhbmEsIEFydW5kaGF0aSwgQXNoYSwgQXZhbmksIEF2YW50aSwgQmFnYXZhdGh5LCBCYWt1bGEsIEJhbGEsIEJoYXZhbmEsIEJoYXZhbmksIEJyaW5kYSwgQ2FuZHJhdmFsaSwgQ2FybGlheWUsIENhcm1hLCBDaGFuZGEsIENoYW5kYW5hLCBDaGFuZGksIENoYW5kcmEsIENoYW5kcmEtS2FudGEsIENoYW5kcmFrYW50YSwgQ2hhdHJhcGF0dHksIENoZXRhbmEsIENoaXRyYSwgRGFsaW5pLCBEYW1heWFuZGksIERhbWF5YW50aSwgRGFyc2hhbmEsIERheWEsIERlZXBhbGksIERlZXB0aSwgRGV2YWtpLCBEZXZpLCBEZXZpa2EsIERpcGEsIERpcGFsaSwgRGlwaWthLCBEaXB0aSwgRGl0aSwgRG91cmdhdmF0aSwgRHJhdXBhZGksIERyaXNodGksIER1cmdhLCBFc2hhLCBHYXVyaSwgR2VldGEsIEdpdGEsIEdpdGlrYSwgR29kYXZhcmksIEdvbWF0aSwgR29waSwgR29waWthLCBHb3dyaSwgSGFtc2EsIElsYSwgSWxhbmlsYSwgSW5kZXJqaXQsIEluZGlyYSwgSW5kcmFuaSwgSW5kdSwgSmFyaXRhLCBKYXN3aW5kZXIsIEpheWEsIEpheWFuaSwgSmF5YW50aSwgSmF5YXNocmksIEp5b3RpLCBKeW90c2FuYSwgSnlvdHNuYSwgS2FqYWwsIEthbGEsIEthbGksIEthbGlrYSwgS2FsaW5kYSwgS2FscGFuYSwgS2FseWFuYS1TaHJhZGRow6IsIEthbWFsYSwgS2FtaW5pLCBLYW5hbWFuLCBLYW5jaGFuYSwgS2FuaWxqYSwgS2FudGEsIEthbnRpLCBLYW55w6ItS291bWFyaSwgS2FyaXNobWEsIEthcml5YW1uYSwgS2FybGF5ZSwgS2FybGlheWUsIEthcnVuYSwgS2FzaGksIEthc2ksIEthdXIsIEthdXNhbHlhLCBLYXZlcmksIEthdml0YSwgS2VzaGF2YSwgS2V2YWxhLCBLaXJhbiwgS2lydGksIEtpcnRpZGEsIEtpc2hvcmksIEtvbWF0aHksIEtvdW1hcmksIEtzaGl0aWphLCBLdW1hcmksIEt1bnRpLCBMYWRoYSwgTGHDr2xpLCBMYWppbGksIExha3NobWksIExhbGl0YSwgTGFsaXRoYSwgTGFsbGlkYSwgTGF0YSwgTGF4bWksIExlZWxhLCBMZWthLCBMaWxhLCBMaWxhdmFkeSwgTGlsYXZhdGksIExvY2hhbmEsIEx1dGNobWF5YWgsIE1hZGhhdmksIE1hZGh1LCBNYWRodXIsIE1hZGh1cmksIE1hZGh1cnlhLCBNYWxhLCBNYWxhdGksIE1hbGluaSwgTWFuZGVlcCwgTWFuamlrYSwgTWFuanUsIE1hbmp1bGEsIE1hbmp1c2hhLCBNYXlhLCBNZWVuYSwgTWVlcmEsIE1pbmFrc2hpLCBNaW5hbGksIE1pbmF0Y2h5LCBNaXJhLCBNb2hhbmEsIE1vaGluaSwgTXJpZHVsYSwgTXVrdGEsIE5hbGluaSwgTmFuZGluaSwgTmFuZGl0YSwgTmFvdW1hbiwgTmVlbGEsIE5pZHLDoiwgTmlraGlsYSwgTmlsYSwgTmlsYW0sIE5pbGltYSwgTmlybWFsYSwgTmlydXBhbWEsIE5pc2hhLCBOaXRoeWEsIE5pdGlhLCBOaXRpa2EsIE5pdHlh";
    const nicks = "Y29vbCwgYW5nZWwsIHN3ZWV0LCBmbG93ZXIsIGN1dGUsIGtpdHR5LCBob25leSwgZGV3LCBsb3ZlbHksIHNleHk";

    /*if (typeof Buffer.from === "function") {
        // Node 5.10+
        
        nicks= Buffer.from(nicknames).toString('base64');
    } else {
        // older Node versions, now deprecated
         g_names= new Buffer.from(grlz).toString('base64');
         nicks= new Buffer.from(nicknames).toString('base64');
    }*/
    res.json({ names: g_names, nicks: nicks, url: port });
});



const getroomID = () => {
    let _id = "";
    for (let i = 0; i < 8; i++) {
        _id = _id + "" + Math.floor(Math.random() * 10)
    }
    return _id.substr(0, 4) + "." + _id.substr(4)
}

const broadcastCellPicks = (socket, status, data) => {
    let socket_room = io.sockets.mygameRooms;
    let _id = data.id;
    for (let i in socket_room) {
        if (socket_room[i].id == _id) {
            socket.broadcast.to(io.sockets.mygameRooms[i].players[0].sock).emit('player2CellPicked', { state: status, cell: data.cell });
            break;
        }
    }
}

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('createRoom', function(data) {
        console.log("Creating for: " + data.player1);

        let obj = {
            id: getroomID(),
            players: [{ sock: socket.id, name: data.player1.toLowerCase() }]
        };


        if (io.sockets.mygameRooms) {
            let soc_room = io.sockets.mygameRooms;
            if (data.preserveReload) {
                for (var j in soc_room) {
                    if (soc_room[j].id == data.id && soc_room[j].players[0].name == data.player1) {
                        soc_room[j].players[0].sock = socket.id;
                        console.log("Create room preserve...");
                        socket.emit("roomcreated", { player: data.player1, id: data.id });
                        //socket.emit("objectDebug", io.sockets.mygameRooms[j]); 
                        break;
                    }
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
        //socket.emit("objectDebug", io.sockets.mygameRooms);      
        let acceptID = data.id;
        if (acceptID.length == 9 && acceptID.includes(".")) {
            let id = acceptID.split(".");
            if (id.length == 2 && id[0].length == 4 && id[1].length == 4) {
                let matched = false;
                let socket_room = io.sockets.mygameRooms;
                for (let rm in socket_room) {
                    if (socket_room[rm].id == acceptID) {
                        matched = true;
                        let ply = socket_room[rm].players;
                        let plName = data.player2.toLowerCase();
                        if ((!socket_room[rm].preserveReload && ply.length == 1) || (socket_room[rm].preserveReload && ply.length == 2)){
                            if (ply[0].name != plName) {
                                if (socket_room[rm].preserveReload) {
                                    console.log("joing room preserve reload");
                                    io.sockets.mygameRooms[rm].players[1].sock = socket.id;
                                    io.sockets.mygameRooms[rm].preserveReload = false;
                                } else {
                                    io.sockets.mygameRooms[rm].players.push({ sock: socket.id, name: plName });
                                }

                                socket.emit('joined', { players: io.sockets.mygameRooms[rm].players, id: acceptID, cells: io.sockets.mygameRooms[rm].cellPoints });
                                socket.broadcast.to(io.sockets.mygameRooms[rm].players[0].sock).emit('player2in', { players: io.sockets.mygameRooms[rm].players, id: acceptID });
                                break;
                            } else {
                                socket.emit('duplicateName', "");
                                break;
                            }
                        } else if (ply.length > 1) {
                            socket.emit('playerfull', "");
                            break;
                        } else {
                            socket.emit('noplayer', "");
                            break;
                        }
                    }
                }
                if (!matched) {
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
        let socket_room = io.sockets.mygameRooms;
        let _id = data.id;
        for (let i in socket_room) {
            if (socket_room[i].id == _id) {
                io.sockets.mygameRooms[i].cellPoints = data.cells;
                if (data.preserve) {
                    socket.emit("objectDebug", socket_room[i]); 
                    socket.broadcast.to(socket_room[i].players[1].sock).emit('Player2Refresh', '');
                }
                break;
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

    socket.on('reqestChallenge', function(data) {
        if (io.sockets.mygameRooms) {
            let rooms = io.sockets.mygameRooms;
            for (let rm in rooms) {
                if (rooms[rm].id == data.id) {
                    socket.broadcast.to(rooms[rm].players[0].sock).emit('ChlngReqFromPlayer2', { id: rooms[rm].id });
                    break;
                }
            }
        }
    });

    socket.on('acceptRequest', function(data) {
        if (io.sockets.mygameRooms) {
            let rooms = io.sockets.mygameRooms;
            for (let rm in rooms) {
                if (rooms[rm].id == data.id) {
                    if (rooms[rm].players.length == 2) {
                        io.sockets.mygameRooms[rm].preserveReload = true;
                        socket.broadcast.to(rooms[rm].players[1].sock).emit('replayReqAccepted', { id: rooms[rm].id, players: rooms[rm].players });
                        break;
                    }

                }
            }
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
                            let theOther = 0;
                            theOther = sid == 0 ? 1 : 0;
                             socket.broadcast.to(rooms[rm].players[theOther].sock).emit('objectDebug', io.sockets.mygameRooms[rm]);
                            
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
                        console.log("found player in socket to disconnect");
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
    res.redirect('/error.html')

});

http.listen(port, () => {
    console.log(`Server running at port ` + port);
})