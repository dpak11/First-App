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


const fetch = require('node-fetch');
const lodash = require('lodash');

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

function generateIndianList() {
    var grlz = "Priya, Tanya, Priyanka, Divya, Tanvi, Ishita, Vani, Anjali, Shreya, Riya, Sneha, Aishwarya, Gayatri, Varsha, Ira, Sanjana, Niharika, Nikita, Natasha, Neha, Shivangi, Ramya, Isha, Ananya, Shivani, Sakshi, Aswini, Suhani, Leah, Pavithra, Seema, Anusha, Simran, Nishi, Anushri, Ayushi, Radhika, Tanu, Krithika, Anisha, Akansha, Sadaf, Nishita, Diya, Siya, Abigail, Kalyani, Rishita, Aastha, Mary, Sara, Prachi, Indhumathi, Shrinidhi, Papuii colney, Rhea, Katherine, Rutuja, Arti, Debbie, Crowny, Manisha, Mahima, Aditi, Aashna, Tisha, Moii chhangte, Sam, Swati, Dia, Ria, Anu, Neelam, N.Priyanka, NISHA, Chandralekha, Mitali, Dawn, Dilmini, Kamalika, Khushi, Anjana, Arya, Deepa, Juvina, Angel, Anamika, Lavanya, Ishika, Lily, Archita, Rashi, Sarah, Sasashy, Vaishnavi, Diksha, Arusha, Niti, Vidhya, Kavya, Abha, Abhilasha, Adhita, Adita, Akanksha, Amala, Ambâ, Amita, Amrita, Ananda, Anandi, Anandita, Ananta, Anantee, Anantha, Anila, Anima, Ankita, Antrija, Anuja, Anupama, Aparajita, Appassamy, Aradhana, Archana, Arundhati, Asha, Avani, Avanti, Bagavathy, Bakula, Bala, Bhavana, Bhavani, Brinda, Candravali, Carliaye, Carma, Chanda, Chandana, Chandi, Chandra, Chandra-Kanta, Chandrakanta, Chatrapatty, Chetana, Chitra, Dalini, Damayandi, Damayanti, Darshana, Daya, Deepali, Deepti, Devaki, Devi, Devika, Dipa, Dipali, Dipika, Dipti, Diti, Dourgavati, Draupadi, Drishti, Durga, Esha, Gauri, Geeta, Gita, Gitika, Godavari, Gomati, Gopi, Gopika, Gowri, Hamsa, Ila, Ilanila, Inderjit, Indira, Indrani, Indu, Jarita, Jaswinder, Jaya, Jayani, Jayanti, Jayashri, Jyoti, Jyotsana, Jyotsna, Kajal, Kala, Kali, Kalika, Kalinda, Kalpana, Kalyana-Shraddhâ, Kamala, Kamini, Kanaman, Kanchana, Kanilja, Kanta, Kanti, Kanyâ-Koumari, Karishma, Kariyamna, Karlaye, Karliaye, Karuna, Kashi, Kasi, Kaur, Kausalya, Kaveri, Kavita, Keshava, Kevala, Kiran, Kirti, Kirtida, Kishori, Komathy, Koumari, Kshitija, Kumari, Kunti, Ladha, Laïli, Lajili, Lakshmi, Lalita, Lalitha, Lallida, Lata, Laxmi, Leela, Leka, Lila, Lilavady, Lilavati, Lochana, Lutchmayah, Madhavi, Madhu, Madhur, Madhuri, Madhurya, Mala, Malati, Malini, Mandeep, Manjika, Manju, Manjula, Manjusha, Maya, Meena, Meera, Minakshi, Minali, Minatchy, Mira, Mohana, Mohini, Mridula, Mukta, Nalini, Nandini, Nandita, Naouman, Neela, Nidrâ, Nikhila, Nila, Nilam, Nilima, Nirmala, Nirupama, Nisha, Nithya, Nitia, Nitika, Nitya";
    var allInds = grlz.split(", ");
    var domains = "hotmail.com, yahoo.com, msn.com, gmail.com, aol.com, rediffmail.com, ymail.com, outlook.com";
    var domainList = domains.split(", ");

    var allnames = allInds.map(function(name) {
        var nicks = ["cool", "angel", "sweet", "flower", "cute", "kitty", "honey", "dew", "lovely", "sexy"];
        var randomiser = Math.floor(Math.random() * 6);
        var new_name = "";
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

    return allnames;

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
    const indianList = generateIndianList();
    const bundleList = [...indianList, ...emaiList];
    const the_list = lodash.shuffle(bundleList);
    let onlyMail = the_list.map(data => {

        return {
            status: statusList[Math.floor(Math.random() * statusList.length)],
            email: data.email
        };

        

    });
    //initConsole(onlyMail, 0);


}


module.exports = sleepFetch;