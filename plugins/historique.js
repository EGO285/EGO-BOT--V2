const fs = require("fs");

const dbPath = "./data/duels.json";

module.exports = {
    command: "#historique",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        if (!fs.existsSync(dbPath)) {
            return sock.sendMessage(from, {
                text: "❌ Aucun historique trouvé."
            });
        }

        const db = JSON.parse(fs.readFileSync(dbPath));

        if (!db.history.length) {
            return sock.sendMessage(from, {
                text: "📭 Aucun duel enregistré."
            });
        }

        let msg = "📜 HISTORIQUE DES DUELS\n\n";

        db.history.slice(-10).forEach((d, i) => {
            msg += `#${i + 1}\n`;
            msg += `🥷 P1: ${d.p1}\n`;
            msg += `🥷 P2: ${d.p2}\n`;
            msg += `🏆 Winner: ${d.winner}\n`;
            msg += `⏱️ Date: ${new Date(d.start).toLocaleString()}\n\n`;
        });

        await sock.sendMessage(from, { text: msg });
    }
};