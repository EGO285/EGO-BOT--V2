const fs = require("fs");

const dbPath = "./data/users.json";

// 🔐 LISTE DES ADMINS (mets ton numéro ici)
const ADMINS = [
    "330665384876", // ton numéro exemple
];

function loadDB() {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

module.exports = {
    command: "#delete",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        // 🔐 ID de celui qui envoie la commande
        const sender = m.key.participant || m.key.remoteJid;

        // 🔐 extraire numéro propre (WhatsApp JID)
        const userNumber = sender.split("@")[0].replace(/\D/g, "");

        // =========================
        // 🚫 CHECK ADMIN
        // =========================
        if (!ADMINS.includes(userNumber)) {
            return sock.sendMessage(from, {
                text: "⛔ ACCÈS REFUSÉ : commande réservée aux admins."
            });
        }

        // =========================
        // 📌 ARGUMENT
        // =========================
        let name = text.replace("#delete", "").trim().toLowerCase();

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

        await sock.sendMessage(from, {
            text: `🗑️ COMPTE SUPPRIMÉ (ADMIN)

👤 Joueur : ${pseudo}
🔐 Supprimé par un administrateur`
        });
    }
};