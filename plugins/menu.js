module.exports = {
    command: "#menu ego",

    async handler(sock, m) {
        const from = m.key.remoteJid;

        await sock.sendMessage(from, {
            image: { url: "https://i.ibb.co/JwZtZgRm/2a2032c80cbb.jpg" },
            caption: `🎴 EGO BOT

Bienvenue sur EGO BOT 🔥

📌 Commandes :

#tirage C → carte C
#tirage B → carte B
#tirage A → carte A
#tirage S → carte S
#tirage random → carte aléatoire
#rules → règles du bot
#verdict → verdict du combat
#duel on → lancer un duel
#duel off → arrêter le duel
#new → créer un compte
#delete → supprimer un compte (admin)
#fiche (user) → voir la fiche d'un joueur
#historique → voir l'historique des duels
#latence → test chrono`
        });
    }
};