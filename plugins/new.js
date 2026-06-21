const fs = require("fs");

const dbPath = "./data/users.json";

function loadDB() {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

module.exports = {
    command: "#new",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        const pseudo = text.replace("#new", "").trim();

        if (!pseudo) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : #new Paul"
            });
        }

        let db = loadDB();

        const key = pseudo.toLowerCase();

        if (db[key]) {
            return sock.sendMessage(from, {
                text: "❌ Ce joueur existe déjà."
            });
        }

        // création joueur
        db[key] = {
            pseudo: pseudo,
            division: "Alpha",
            money: 0,
            stars: 0,
            cards: 0,
            wins: 0,
            loses: 0,
            points: 0,
            rank: "23ème"
        };

        saveDB(db);

        // =========================
        // 📄 FICHE EXACTE DEMANDÉE
        // =========================
        const msg =
            `*_▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩_*
*_🔶SHINOBI STORM RP🎮_*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🥇Fiche Shinobi Ultimate League🏆*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_▲Pseudo👤:_ ${pseudo}

_▲DIVISION⚪️: *Alpha⚪️*_

_▲BOURSE💰: *00🔶*_ 

_▲STARS⭐️ : *00⭐️*_ 

_▲Card de Réduction 🎟: *0 🎟*_
▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰
░░░░░░░░░░░░░░░░░░░
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_*🔢Records*:_ 
_00 Victoires🏆/ 00 Défaite😭_
_*🏆 Points*: 00🌟_ 

_RANG *SUL🏅*: 23ème_
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*_🛍🛒ACHATS CARDS: _*
▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰
*_▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩_*`;

        await sock.sendMessage(from, { text: msg });
    }
};