// module.exports = {
//     command: "#latence",

//     async handler(sock, m) {
//         const from = m.key.remoteJid;
//         const user = m.key.participant || m.key.remoteJid;

//         await sock.sendMessage(from, {
//             text: `⏱️ Début du chronomètre ⏱️ !!`,
//             mentions: [user]
//         });

//         setTimeout(async() => {
//             await sock.sendMessage(from, {
//                 text: "🚨 TIME UP !!!"
//             });
//         }, 420000); // 7 minutes
//     }
// };
const chronos = require("../chronoData");

module.exports = {
    command: "#latence",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        if (chronos[from]) {
            return sock.sendMessage(from, {
                text: "⚠️ Un chronomètre est déjà en cours."
            });
        }

        await sock.sendMessage(from, {
            text: "⏱️ Début du chronomètre !!\nTape #stop pour l'arrêter."
        });

        chronos[from] = setTimeout(async() => {
            delete chronos[from];

            await sock.sendMessage(from, {
                text: "🚨 TIME UP !!!"
            });
        }, 420000); // 7 min
    }
};