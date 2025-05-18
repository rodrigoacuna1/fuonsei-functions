const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Reemplazá con tus credenciales de Agora
const APP_ID = "fde50799f5e047ea8ece980d13685649";
const APP_CERTIFICATE = "5a8c6eb8e7ec437e8acc5debb2159f79";

// Ruta para generar el token
app.get("/generate-agora-token", (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  if (!channelName) {
    return res.status(400).json({ error: "Falta channelName" });
  }

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return res.json({ token });
  } catch (error) {
    console.error("Error generando token:", error);
    return res.status(500).json({ error: "Error generando token" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
