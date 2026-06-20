const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const pino = require("pino");
const http = require("http");

// Serveur HTTP bidon pour éviter les erreurs de déploiement (Render/Heroku)
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("EGO BOT is running\n");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur HTTP en écoute sur le port ${PORT}`);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "silent" })
    });

    // Génération du Pairing Code
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER || "33665384876";
        console.log(`Demande de pairing code pour le numéro : ${phoneNumber}`);

        // Attendre un peu que la connexion soit prête avant de demander le code
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log("====================================");
                console.log("      🎴 EGO BOT - PAIRING CODE");
                console.log("====================================");
                console.log(`CODE : ${code}`);
                console.log("====================================");
            } catch (error) {
                console.error("Erreur lors de la demande du pairing code :", error);
            }
        }, 5000);
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ?
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log("Connexion fermée. Reconnexion :", shouldReconnect);
            if (lastDisconnect.error) {
                console.error("Erreur de déconnexion :", lastDisconnect.error);
            }
            if (shouldReconnect) {
                console.log("Tentative de reconnexion...");
                startBot();
            }
        } else if (connection === "open") {
            console.log("✅ EGO BOT est connecté !");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const text = (
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            ""
        ).toLowerCase();

        fs.readdirSync("./plugins").forEach(file => {
            if (file.endsWith(".js")) {
                delete require.cache[require.resolve(`./plugins/${file}`)];
                const cmd = require(`./plugins/${file}`);
                if (text.startsWith(cmd.command)) {
                    cmd.handler(sock, m, text);
                }
            }
        });
    });
}

startBot();
