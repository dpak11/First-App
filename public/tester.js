/*jshint esversion: 6 */

//const brain = require('brain.js');

/*
const net = new brain.NeuralNetwork({ hiddenLayers: [3] });
net.train([{ input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] }
]);

console.log(net.run([1, 0])); */

/*
const myarray = [3, 4, 7, 4, 5, 8];
let newlist = myarray.map(val => val * 2);
console.log(newlist);*/


/*const net = new brain.recurrent.LSTM();

net.train([
  { input: 'likes eat', output: 'yes' },
  { input: 'likes sleep', output: 'no' },
  { input: 'Rude', output: 'yes' },
  { input: 'Talkative', output: 'yes' },
  { input: 'playful', output: 'yes' },
  { input: 'selfish', output: 'no' },
  { input: 'likes shopping', output: 'no' },
  { input: 'intelligent', output: 'yes' },
  { input: 'workaholic', output: 'yes' },
],{
    log: (error) => console.log(error)
});

console.log(net.run('he is a workaholic who likes to sleep and likes to shop'));*/

//const net = new brain.recurrent.LSTMTimeStep();
/*net.train([
    [0,1,2,3,4,5,6,7,8,9]
    ],{
    log: (error) => console.log(error)
});
*/
/*
net.train([
  {input:[1,2],output:[2]},
  {input:[2,1],output:[2]},  
  {input:[2,3],output:[1]},
  {input:[3,2],output:[1]},
  {input:[1,3],output:[3]}   
],{
    log: (error) => console.log(error)
});

console.log(net.run([3,1]));  
*/







//const fetch = require('node-fetch');
//const lodash = require('lodash');

function sleep(seconds) {
    let ms = seconds * 1000;
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
}


function initConsole(mail, num) {
    if ((mail.length - 1) > num) {
        let numb = num + 1;
        const timegaps = [200, 300, 500, 2000];
        let duration = timegaps[Math.floor(Math.random() * 4)];
        setTimeout(() => {
                console.log(mail[num].email + " ------>>  " + mail[num].status);
                var para = document.createElement("p");
                para.innerText = `${mail[num].email} ------>> ${mail[num].status}`;
                document.body.appendChild(para);
            initConsole(mail, numb);
        }, duration);
}

}

async function generateIndianList() {
    const namelist = await fetch("/api/names").catch(e => console.log("............."+e));
    const ind_fem = await namelist.json();
    let allInds = window.atob(ind_fem.names).split(", ");
    let domains = "hotmail.com, yahoo.com, msn.com, gmail.com, aol.com, rediffmail.com, ymail.com, outlook.com";
    let domainList = domains.split(", ");
    let nicks = window.atob(ind_fem.nicks).split(", ");

    let allnames = allInds.map(function(name) {        
        let randomiser = Math.floor(Math.random() * 6);
        let new_name = "";
        if (name.length < 5) {
            if (randomiser > 3) {
                new_name = name + "_" + nicks[Math.floor(Math.random() * 10)] + "_" + (1000 + Math.round(Math.random() * 9000));
            } else {
                new_name = name + "19" + (Math.round(Math.random() * 40) + 60) + nicks[Math.floor(Math.random() * 10)];
            }

        } else {
            if (randomiser == 0) {
                new_name = name.substr(0, 3) + "19" + (Math.round(Math.random() * 40) + 60) + "_" + (1000 + Math.round(Math.random() * 9000));
            }
            if (randomiser == 1) {
                new_name = name.substr(0, 3) + "" + (Math.round(Math.random() * 40) + 60) + "_" + (1000 + Math.round(Math.random() * 9000));
            }
            if (randomiser == 2) {
                new_name = name + "19" + (Math.round(Math.random() * 40) + 60);
            }
            if (randomiser == 3) {
                new_name = name + "" + (Math.round(Math.random() * 40) + 60);
            }
            if (randomiser == 4) {
                new_name = name + "_" + nicks[Math.floor(Math.random() * 10)];
            }
            if (randomiser == 5) {
                new_name = name.substr(0, 3) + "_" + nicks[Math.floor(Math.random() * 10)] + "" + (1000 + Math.round(Math.random() * 9000));
            }
        }
        return {
            name: name,
            email: new_name + "@" + domainList[Math.floor(Math.random() * domainList.length)]
        };

    });

    return new Promise((res,rej) => res(allnames));

}

async function sleepFetch(n) {
    console.log("Searching...");
    let sleeping = await sleep(n);
    console.log("Asynchrous loop started...");
    console.log("Now fetching....");
    let jsondata = await fetch("https://jsonplaceholder.typicode.com/comments");
    let json = await jsondata.json();
    let emaiList = json.filter(data => data.email.includes(".com") || data.email.includes(".org") || data.email.includes(".net") || data.email.includes(".us") || data.email.includes(".co.uk"));
    const statusList = ["Div...", "Single", "Single moth...", "Married", "[Unknown]", "[Private]", "[Private]"];
    const indianList = await generateIndianList();

    const bundleList = [...indianList, ...emaiList];
    const the_list = _.shuffle(bundleList);
    let onlyMail = the_list.map(data => {

        return {
            status: statusList[Math.floor(Math.random() * statusList.length)],
            email: data.email
        };

    });
    initConsole(onlyMail, 0);
}

sleepFetch(2);

//module.exports = sleepFetch;