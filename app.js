const express = require("express");
const app = express();
//const tester = require('./tester');

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;


app.use(function (req, res, next) {
	console.log(req.path);
    if (req.path.includes('.html')) {
        res.redirect('/error.html');
    }else{
    	return next();
    } 
});

app.get("/", (req, res) => {
    console.log("main page >> " + __dirname);
    res.sendFile(__dirname + "/public/main.html");

});
app.get("/api/names", (req, res) => {
    console.log("names api call... ");
    const grlz = "Priya, Tanya, Priyanka, Divya, Tanvi, Ishita, Vani, Anjali, Shreya, Riya, Sneha, Aishwarya, Gayatri, Varsha, Ira, Sanjana, Niharika, Nikita, Natasha, Neha, Shivangi, Ramya, Isha, Ananya, Shivani, Sakshi, Aswini, Suhani, Leah, Pavithra, Seema, Anusha, Simran, Nishi, Anushri, Ayushi, Radhika, Tanu, Krithika, Anisha, Akansha, Sadaf, Nishita, Diya, Siya, Abigail, Kalyani, Rishita, Aastha, Mary, Sara, Prachi, Indhumathi, Shrinidhi, Papuii colney, Rhea, Katherine, Rutuja, Arti, Debbie, Crowny, Manisha, Mahima, Aditi, Aashna, Tisha, Moii chhangte, Sam, Swati, Dia, Ria, Anu, Neelam, N.Priyanka, NISHA, Chandralekha, Mitali, Dawn, Dilmini, Kamalika, Khushi, Anjana, Arya, Deepa, Juvina, Angel, Anamika, Lavanya, Ishika, Lily, Archita, Rashi, Sarah, Sasashy, Vaishnavi, Diksha, Arusha, Niti, Vidhya, Kavya, Abha, Abhilasha, Adhita, Adita, Akanksha, Amala, Ambâ, Amita, Amrita, Ananda, Anandi, Anandita, Ananta, Anantee, Anantha, Anila, Anima, Ankita, Antrija, Anuja, Anupama, Aparajita, Appassamy, Aradhana, Archana, Arundhati, Asha, Avani, Avanti, Bagavathy, Bakula, Bala, Bhavana, Bhavani, Brinda, Candravali, Carliaye, Carma, Chanda, Chandana, Chandi, Chandra, Chandra-Kanta, Chandrakanta, Chatrapatty, Chetana, Chitra, Dalini, Damayandi, Damayanti, Darshana, Daya, Deepali, Deepti, Devaki, Devi, Devika, Dipa, Dipali, Dipika, Dipti, Diti, Dourgavati, Draupadi, Drishti, Durga, Esha, Gauri, Geeta, Gita, Gitika, Godavari, Gomati, Gopi, Gopika, Gowri, Hamsa, Ila, Ilanila, Inderjit, Indira, Indrani, Indu, Jarita, Jaswinder, Jaya, Jayani, Jayanti, Jayashri, Jyoti, Jyotsana, Jyotsna, Kajal, Kala, Kali, Kalika, Kalinda, Kalpana, Kalyana-Shraddhâ, Kamala, Kamini, Kanaman, Kanchana, Kanilja, Kanta, Kanti, Kanyâ-Koumari, Karishma, Kariyamna, Karlaye, Karliaye, Karuna, Kashi, Kasi, Kaur, Kausalya, Kaveri, Kavita, Keshava, Kevala, Kiran, Kirti, Kirtida, Kishori, Komathy, Koumari, Kshitija, Kumari, Kunti, Ladha, Laïli, Lajili, Lakshmi, Lalita, Lalitha, Lallida, Lata, Laxmi, Leela, Leka, Lila, Lilavady, Lilavati, Lochana, Lutchmayah, Madhavi, Madhu, Madhur, Madhuri, Madhurya, Mala, Malati, Malini, Mandeep, Manjika, Manju, Manjula, Manjusha, Maya, Meena, Meera, Minakshi, Minali, Minatchy, Mira, Mohana, Mohini, Mridula, Mukta, Nalini, Nandini, Nandita, Naouman, Neela, Nidrâ, Nikhila, Nila, Nilam, Nilima, Nirmala, Nirupama, Nisha, Nithya, Nitia, Nitika, Nitya";
    const nicknames = "cool, angel, sweet, flower, cute, kitty, honey, dew, lovely, sexy";
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

app.listen(port, () => {
    console.log(`Server running at port ` + port);
})