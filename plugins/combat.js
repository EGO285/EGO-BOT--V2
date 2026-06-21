const fs = require("fs");

module.exports = {
    command: "#combat",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        const dbPath = "./data/combats.json";
        const db = JSON.parse(fs.readFileSync(dbPath));

        db.active[from] = {
            players: [],
            messages: [],
            status: "waiting"
        };

        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        await sock.sendMessage(from, {
            text: "⚔️ Combat lancé ! Envoyez vos pavés.\nTape #verdict quand vous êtes prêts."
        });
    }
};