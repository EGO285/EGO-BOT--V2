const chronos = require("../chronoData");

module.exports = {
    command: "#stop",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        if (!chronos[from]) {
            return sock.sendMessage(from, {
                text: "❌ Aucun chronomètre en cours."
            });
        }

        clearTimeout(chronos[from]);
        delete chronos[from];

        await sock.sendMessage(from, {
            text: "⏹️ Chrono arrêté !!"
        });
    }
};