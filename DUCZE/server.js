const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
    console.error(
        "Brak konta w bazie danych."
    );

    process.exit(1);
}

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname)
    )
);

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

        const discordResponse =
            await fetch(
                WEBHOOK_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        username: "DUCZE",

                        embeds: [
                            {
                                title:
                                    "Nowe zgłoszenie",

                                fields: [
                                    {
                                        name:
                                            "Pole 1",

                                        value:
                                            pole1
                                                .trim()
                                                .substring(
                                                    0,
                                                    1024
                                                ),

                                        inline: false
                                    },

                                    {
                                        name:
                                            "Pole 2",

                                        value:
                                            pole2
                                                .trim()
                                                .substring(
                                                    0,
                                                    1024
                                                ),

                                        inline: false
                                    }
                                ],

                                color: 6730740,

                                timestamp:
                                    new Date()
                                        .toISOString()
                            }
                        ]
                    })
                }
            );

        if (!discordResponse.ok) {

            const errorText =
                await discordResponse.text();

            console.error(
                "Discord error:",
                discordResponse.status,
                errorText
            );

            return res.status(502).json({
                error:
                    "Jajca ci wybuchły."
            });
        }

        return res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error:
                "Wystąpił błąd serwera."
        });
    }
});

app.listen(PORT, () => {

    console.log(
        `Server działa na porcie ${PORT}`
    );

});
