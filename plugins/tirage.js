const cartes = require("../cartes.json");

function filterByRarete(rarete) {
    return cartes.filter(c => c.rarete === rarete);
}

module.exports = {
    command: "#tirage",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        let liste;

        if (text === "#tirage c") liste = filterByRarete("C");
        else if (text === "#tirage b") liste = filterByRarete("B");
        else if (text === "#tirage a") liste = filterByRarete("A");
        else if (text === "#tirage s") liste = filterByRarete("S");
        else if (text === "#tirage random") liste = cartes;
        else return;

        const carte = liste[Math.floor(Math.random() * liste.length)];

        await sock.sendMessage(from, {
            image: { url: carte.image },
            caption: `🎴 EGO BOT

👤 Nom : ${carte.nom}
📺 Anime : ${carte.anime}
⭐ Rareté : ${carte.rarete}`
        });
    }
};