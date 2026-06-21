const fs = require("fs");

const dbPath = "./data/users.json";

// =========================
// 📦 DB FUNCTIONS
// =========================
function loadDB() {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// =========================
// 🚀 COMMAND
// =========================
module.exports = {
    command: "#delete",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        let name = text
            .replace("#delete", "")
            .replace("@", "")
            .trim()
            .toLowerCase();

        if (!name) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : #delete paul"
            });
        }

        let db = loadDB();

        if (!db[name]) {
            return sock.sendMessage(from, {
                text: "❌ Joueur introuvable."
            });
        }

        const pseudo = db[name].pseudo;

        delete db[name];

        saveDB(db);

        return sock.sendMessage(from, {
            text: `🗑️ COMPTE SUPPRIMÉ

👤 Joueur : ${pseudo}
⚠️ Fiche supprimée avec succès`
        });
    }
};