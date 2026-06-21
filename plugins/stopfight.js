const fs = require("fs");

module.exports = {
    command: "#stop",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        const db = JSON.parse(fs.readFileSync("./data/combats.json"));

        if (!db.active[from]) {
            return sock.sendMessage(from, {
                text: "❌ Aucun combat en cours."
            });
        }

        delete db.active[from];

        fs.writeFileSync("./data/combats.json", JSON.stringify(db, null, 2));

        await sock.sendMessage(from, {
            text: "⏹️ Chrono arrêté !! Combat annulé."
        });
    }
};