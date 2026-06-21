module.exports = {
    command: "#verdict",

    async handler(sock, m, text) {
        const from = m.key.remoteJid;

        let content = text.replace("#verdict", "").trim();
        content = content.replace(/\n/g, " ");

        const parts = content.split("vs");

        if (parts.length < 2) {
            return sock.sendMessage(from, {
                text: "❌ Format invalide !\n👉 #verdict PAVÉ1 vs PAVÉ2"
            });
        }

        const p1 = parts[0].trim();
        const p2 = parts[1].trim();

        if (!p1 || !p2) {
            return sock.sendMessage(from, {
                text: "❌ Un des pavés est vide !"
            });
        }

        // =========================
        // 🎬 NARRATION STYLE ANIME
        // =========================
        function narrate(text, name) {
            let t = text
                .replace(/\./g, ". ")
                .replace(/\s+/g, " ")
                .trim();

            if (t.length > 250) {
                t = t.slice(0, 250) + "...";
            }

            return `🎬 ${name} entre dans l'arène...\n\n${t}`;
        }

        const story1 = narrate(p1, "JOUEUR 1");
        const story2 = narrate(p2, "JOUEUR 2");

        // =========================
        // ⚔️ ANALYSE SIMPLE
        // =========================
        let score1 = 0;
        let score2 = 0;

        const attack = ["attaque", "rasengan", "chidori", "coup", "frappe", "jutsu"];
        const defense = ["esquive", "bloque", "parade", "défense"];
        const speed = ["rapide", "vite", "boost", "instant"];

        function analyze(txt, score) {
            txt = txt.toLowerCase();

            attack.forEach(w => {
                if (txt.includes(w)) score += 2;
            });

            defense.forEach(w => {
                if (txt.includes(w)) score += 1;
            });

            speed.forEach(w => {
                if (txt.includes(w)) score += 1;
            });

            return score;
        }

        score1 = analyze(p1, score1);
        score2 = analyze(p2, score2);

        // =========================
        // 🏆 VERDICT ÉPIQUE
        // =========================
        let result = "⚖️ MATCH ÉQUILIBRÉ... PERSONNE NE DOMINE";

        if (score1 > score2) {
            result = "🔥 DOMINATION DU JOUEUR 1 ! L’adversaire vacille sous la pression !";
        }

        if (score2 > score1) {
            result = "🔥 DOMINATION DU JOUEUR 2 ! Une contre-attaque dévastatrice change tout !";
        }

        // =========================
        // 📤 OUTPUT FINAL
        // =========================
        await sock.sendMessage(from, {
            text: `⚔️ COMBAT EN DIRECT — MODE NARRATEUR ANIME ⚔️

${story1}

━━━━━━━━━━━━━━

${story2}

━━━━━━━━━━━━━━

📊 ANALYSE DU COMBAT :
• Puissance J1 : ${score1}
• Puissance J2 : ${score2}

🏆 VERDICT FINAL :
${result}

🎥 FIN DU COMBAT...`
        });
    }
};