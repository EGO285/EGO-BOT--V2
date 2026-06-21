const fs = require("fs");

const dbPath = "./data/users.json";

function getDB() {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath));
}

module.exports = {
    command: "#fiche",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        let name = text.replace("#fiche", "").trim().toLowerCase();

        if (!name) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : #fiche paul"
            });
        }

        const db = getDB();
        const user = db[name];

        if (!user) {
            return sock.sendMessage(from, {
                text: "❌ Joueur introuvable."
            });
        }

        const msg =
            `*_▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩_*
*_🔶SHINOBI STORM RP🎮_*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🥇Fiche Shinobi Ultimate League🏆*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_▲Pseudo👤:_ ${user.pseudo}

_▲DIVISION⚪️: *${user.division}⚪️*_

_▲BOURSE💰: *${user.money}🔶*_ 

_▲STARS⭐️ : *${user.stars}⭐️*_

_▲Card de Réduction 🎟: *${user.cards || 0} 🎟*_
▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰
░░░░░░░░░░░░░░░░░░░
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_*🔢Records*:_ 
_${user.wins} Victoires🏆/ ${user.loses} Défaite😭_
_*🏆 Points*: ${user.points || 0}🌟_ 

_RANG *SUL🏅*: ${user.rank || "23ème"}_
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*_🛍🛒ACHATS CARDS: _*
▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰
*_▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩▢▩_*`;

        await sock.sendMessage(from, { text: msg });
    }
};