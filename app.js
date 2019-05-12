const express = require("express");
const app = express();
//const tester = require('./tester');

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;


/*app.use(function (req, res, next) {
	console.log(req.path);
    if (req.path.includes('.html')) {
        res.redirect('/error.html');
    }else{
    	return next();
    } 
});*/

app.get("/", (req, res) => {
    console.log("main page >> " + __dirname);
    res.sendFile(__dirname + "/public/main.html");

});
app.get("/api/names", (req, res) => {
    console.log("names api call... ");
    const grlz = "UHJpeWEsIFRhbnlhLCBQcml5YW5rYSwgRGl2eWEsIFRhbnZpLCBJc2hpdGEsIFZhbmksIEFuamFsaSwgU2hyZXlhLCBSaXlhLCBTbmVoYSwgQWlzaHdhcnlhLCBHYXlhdHJpLCBWYXJzaGEsIElyYSwgU2FuamFuYSwgTmloYXJpa2EsIE5pa2l0YSwgTmF0YXNoYSwgTmVoYSwgU2hpdmFuZ2ksIFJhbXlhLCBJc2hhLCBBbmFueWEsIFNoaXZhbmksIFNha3NoaSwgQXN3aW5pLCBTdWhhbmksIExlYWgsIFBhdml0aHJhLCBTZWVtYSwgQW51c2hhLCBTaW1yYW4sIE5pc2hpLCBBbnVzaHJpLCBBeXVzaGksIFJhZGhpa2EsIFRhbnUsIEtyaXRoaWthLCBBbmlzaGEsIEFrYW5zaGEsIFNhZGFmLCBOaXNoaXRhLCBEaXlhLCBTaXlhLCBBYmlnYWlsLCBLYWx5YW5pLCBSaXNoaXRhLCBBYXN0aGEsIE1hcnksIFNhcmEsIFByYWNoaSwgSW5kaHVtYXRoaSwgU2hyaW5pZGhpLCBQYXB1aWkgY29sbmV5LCBSaGVhLCBLYXRoZXJpbmUsIFJ1dHVqYSwgQXJ0aSwgRGViYmllLCBDcm93bnksIE1hbmlzaGEsIE1haGltYSwgQWRpdGksIEFhc2huYSwgVGlzaGEsIE1vaWkgY2hoYW5ndGUsIFNhbSwgU3dhdGksIERpYSwgUmlhLCBBbnUsIE5lZWxhbSwgTi5Qcml5YW5rYSwgTklTSEEsIENoYW5kcmFsZWtoYSwgTWl0YWxpLCBEYXduLCBEaWxtaW5pLCBLYW1hbGlrYSwgS2h1c2hpLCBBbmphbmEsIEFyeWEsIERlZXBhLCBKdXZpbmEsIEFuZ2VsLCBBbmFtaWthLCBMYXZhbnlhLCBJc2hpa2EsIExpbHksIEFyY2hpdGEsIFJhc2hpLCBTYXJhaCwgU2FzYXNoeSwgVmFpc2huYXZpLCBEaWtzaGEsIEFydXNoYSwgTml0aSwgVmlkaHlhLCBLYXZ5YSwgQWJoYSwgQWJoaWxhc2hhLCBBZGhpdGEsIEFkaXRhLCBBa2Fua3NoYSwgQW1hbGEsIEFtYsOiLCBBbWl0YSwgQW1yaXRhLCBBbmFuZGEsIEFuYW5kaSwgQW5hbmRpdGEsIEFuYW50YSwgQW5hbnRlZSwgQW5hbnRoYSwgQW5pbGEsIEFuaW1hLCBBbmtpdGEsIEFudHJpamEsIEFudWphLCBBbnVwYW1hLCBBcGFyYWppdGEsIEFwcGFzc2FteSwgQXJhZGhhbmEsIEFyY2hhbmEsIEFydW5kaGF0aSwgQXNoYSwgQXZhbmksIEF2YW50aSwgQmFnYXZhdGh5LCBCYWt1bGEsIEJhbGEsIEJoYXZhbmEsIEJoYXZhbmksIEJyaW5kYSwgQ2FuZHJhdmFsaSwgQ2FybGlheWUsIENhcm1hLCBDaGFuZGEsIENoYW5kYW5hLCBDaGFuZGksIENoYW5kcmEsIENoYW5kcmEtS2FudGEsIENoYW5kcmFrYW50YSwgQ2hhdHJhcGF0dHksIENoZXRhbmEsIENoaXRyYSwgRGFsaW5pLCBEYW1heWFuZGksIERhbWF5YW50aSwgRGFyc2hhbmEsIERheWEsIERlZXBhbGksIERlZXB0aSwgRGV2YWtpLCBEZXZpLCBEZXZpa2EsIERpcGEsIERpcGFsaSwgRGlwaWthLCBEaXB0aSwgRGl0aSwgRG91cmdhdmF0aSwgRHJhdXBhZGksIERyaXNodGksIER1cmdhLCBFc2hhLCBHYXVyaSwgR2VldGEsIEdpdGEsIEdpdGlrYSwgR29kYXZhcmksIEdvbWF0aSwgR29waSwgR29waWthLCBHb3dyaSwgSGFtc2EsIElsYSwgSWxhbmlsYSwgSW5kZXJqaXQsIEluZGlyYSwgSW5kcmFuaSwgSW5kdSwgSmFyaXRhLCBKYXN3aW5kZXIsIEpheWEsIEpheWFuaSwgSmF5YW50aSwgSmF5YXNocmksIEp5b3RpLCBKeW90c2FuYSwgSnlvdHNuYSwgS2FqYWwsIEthbGEsIEthbGksIEthbGlrYSwgS2FsaW5kYSwgS2FscGFuYSwgS2FseWFuYS1TaHJhZGRow6IsIEthbWFsYSwgS2FtaW5pLCBLYW5hbWFuLCBLYW5jaGFuYSwgS2FuaWxqYSwgS2FudGEsIEthbnRpLCBLYW55w6ItS291bWFyaSwgS2FyaXNobWEsIEthcml5YW1uYSwgS2FybGF5ZSwgS2FybGlheWUsIEthcnVuYSwgS2FzaGksIEthc2ksIEthdXIsIEthdXNhbHlhLCBLYXZlcmksIEthdml0YSwgS2VzaGF2YSwgS2V2YWxhLCBLaXJhbiwgS2lydGksIEtpcnRpZGEsIEtpc2hvcmksIEtvbWF0aHksIEtvdW1hcmksIEtzaGl0aWphLCBLdW1hcmksIEt1bnRpLCBMYWRoYSwgTGHDr2xpLCBMYWppbGksIExha3NobWksIExhbGl0YSwgTGFsaXRoYSwgTGFsbGlkYSwgTGF0YSwgTGF4bWksIExlZWxhLCBMZWthLCBMaWxhLCBMaWxhdmFkeSwgTGlsYXZhdGksIExvY2hhbmEsIEx1dGNobWF5YWgsIE1hZGhhdmksIE1hZGh1LCBNYWRodXIsIE1hZGh1cmksIE1hZGh1cnlhLCBNYWxhLCBNYWxhdGksIE1hbGluaSwgTWFuZGVlcCwgTWFuamlrYSwgTWFuanUsIE1hbmp1bGEsIE1hbmp1c2hhLCBNYXlhLCBNZWVuYSwgTWVlcmEsIE1pbmFrc2hpLCBNaW5hbGksIE1pbmF0Y2h5LCBNaXJhLCBNb2hhbmEsIE1vaGluaSwgTXJpZHVsYSwgTXVrdGEsIE5hbGluaSwgTmFuZGluaSwgTmFuZGl0YSwgTmFvdW1hbiwgTmVlbGEsIE5pZHLDoiwgTmlraGlsYSwgTmlsYSwgTmlsYW0sIE5pbGltYSwgTmlybWFsYSwgTmlydXBhbWEsIE5pc2hhLCBOaXRoeWEsIE5pdGlhLCBOaXRpa2EsIE5pdHlh";
    const nicknames = "Y29vbCwgYW5nZWwsIHN3ZWV0LCBmbG93ZXIsIGN1dGUsIGtpdHR5LCBob25leSwgZGV3LCBsb3ZlbHksIHNleHk";
    let g_names;
    let nicks;
    if (typeof Buffer.from === "function") {
	    // Node 5.10+
	    g_names= Buffer.from(grlz).toString('base64');
	    nicks= Buffer.from(nicknames).toString('base64');
	} else {
	    // older Node versions, now deprecated
	     g_names= new Buffer.from(grlz).toString('base64');
	     nicks= new Buffer.from(nicknames).toString('base64');
	}
    res.json({names:g_names, nicks:nicks});
});

app.get('/*', (req, res) => {
   res.redirect('/error.html');
   res.send("PORT:"+port)
});

app.listen(port, () => {
    console.log(`Server running at port ` + port);
})