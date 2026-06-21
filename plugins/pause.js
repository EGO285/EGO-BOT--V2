const chronos = require("../chronoData");

module.exports = {
    command: "#pause",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        if (!chronos.active[from]) {
            return sock.sendMessage(from, {
                text: "❌ Aucun chronomètre actif."
            });
        }

        const chrono = chronos.active[from];

        clearTimeout(chrono.timeout);

        const elapsed = Date.now() - chrono.start;
        const remaining = chrono.remaining - elapsed;

        chronos.paused[from] = {
            remaining: remaining > 0 ? remaining : 0
        };

        delete chronos.active[from];

        return sock.sendMessage(from, {
            text: "⏸️ Chronomètre en pause !!"
        });
    }
};