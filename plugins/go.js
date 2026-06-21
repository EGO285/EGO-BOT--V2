const chronos = require("../chronoData");

module.exports = {
    command: "#go",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        if (!chronos.paused[from]) {
            return sock.sendMessage(from, {
                text: "❌ Aucun chronomètre en pause."
            });
        }

        const remaining = chronos.paused[from].remaining;

        const timeout = setTimeout(async() => {
            await sock.sendMessage(from, {
                text: "🚨 TIME UP !!!"
            });

            delete chronos.active[from];
        }, remaining);

        chronos.active[from] = {
            timeout,
            remaining,
            start: Date.now()
        };

        delete chronos.paused[from];

        return sock.sendMessage(from, {
            text: "▶️ Chronomètre relancé !!"
        });
    }
};