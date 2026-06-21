const chronos = require("../chronoData");

module.exports = {
    command: "#latence",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        // =========================
        // ⛔ déjà actif
        // =========================
        if (chronos.active[from]) {
            return sock.sendMessage(from, {
                text: "⚠️ Un chronomètre est déjà en cours."
            });
        }

        // =========================
        // ▶ lancement chrono
        // =========================
        await sock.sendMessage(from, {
            text: "⏱️ Début du chronomètre !!\n\n⏸ #pause | ▶ #go | ⛔ #stop"
        });

        const duration = 420000; // 7 min

        const timeout = setTimeout(async() => {
            await sock.sendMessage(from, {
                text: "🚨 TIME UP !!!"
            });

            delete chronos.active[from];
        }, duration);

        // =========================
        // 💾 STOCKAGE PRO
        // =========================
        chronos.active[from] = {
            timeout,
            remaining: duration,
            start: Date.now()
        };
    }
};