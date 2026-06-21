const fs = require("fs");

const dbPath = "./data/users.json";

// =========================
// 📦 LOAD DB
// =========================
function loadDB() {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// =========================
// 🏅 RANKING GLOBAL
// =========================
function updateRanking(db) {
    const users = Object.values(db);

    users.sort((a, b) => (b.points || 0) - (a.points || 0));

    users.forEach((u, i) => {
        const key = u.pseudo.toLowerCase();
        db[key].rank = i + 1;
    });

    return db;
}

// =========================
// 📄 FICHE FORMAT EXACT
// =========================
function buildFiche(u) {
    return `*_▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩_*
*_🔶SHINOBI STORM RP🎮_*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🥇Fiche Shinobi Ultimate League🏆*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_▲Pseudo👤:_ ${u.pseudo}

_▲DIVISION⚪️: *${u.division}⚪️*_

_▲BOURSE💰: *${u.money}🔶*_ 

_▲STARS⭐️ : *${u.stars}⭐️*_ 

_▲Card de Réduction 🎟: *${u.cards || 0} 🎟*_
▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰
░░░░░░░░░░░░░░░░░░░
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_*🔢Records*:_ 
_${u.wins} Victoires🏆/ ${u.loses} Défaite😭_
_*🏆 Points*: ${u.points}🌟_ 

_RANG *SUL🏅*: ${u.rank || 23}ème_
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*_🛍🛒ACHATS CARDS: _*
▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰
*_▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩_*`;
}

module.exports = {
    command: "#",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        let db = loadDB();

        // =========================
        // 🏆 WIN
        // =========================
        if (text.startsWith("#win")) {

            const name = text.replace("#win", "").trim().toLowerCase();

            if (!db[name]) {
                return sock.sendMessage(from, { text: "❌ Joueur introuvable." });
            }

            db[name].wins += 1;
            db[name].points += 3;
            db[name].money += 50000;

            db = updateRanking(db);
            saveDB(db);

            return sock.sendMessage(from, {
                text: `🏆 VICTOIRE ENREGISTRÉE !

${buildFiche(db[name])}`
            });
        }

        // =========================
        // 💀 LOSE
        // =========================
        if (text.startsWith("#lose")) {

            const name = text.replace("#lose", "").trim().toLowerCase();

            if (!db[name]) {
                return sock.sendMessage(from, { text: "❌ Joueur introuvable." });
            }

            db[name].loses += 1;
            db[name].money += 10000;

            db = updateRanking(db);
            saveDB(db);

            return sock.sendMessage(from, {
                text: `💀 DÉFAITE ENREGISTRÉE !

${buildFiche(db[name])}`
            });
        }
    }
};