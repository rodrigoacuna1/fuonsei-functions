const functions = require("firebase-functions");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

// Reemplazá con tu App ID y App Certificate de Agora
const APP_ID = "fde50799f5e047ea8ece980d13685649";
const APP_CERTIFICATE = "5a8c6eb8e7ec437e8acc5debb2159f79";

exports.generateAgoraToken = functions.https.onRequest((req, res) => {
  // Para simplificar, usaremos los query params para recibir channelName y uid
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0; // uid puede ser 0 (invitado) o un número
  const role = RtcRole.PUBLISHER; // roles: PUBLISHER o SUBSCRIBER
  const expirationTimeInSeconds = 3600; // token válido 1 hora
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  if (!channelName) {
    return res.status(400).send("Falta channelName");
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
    return res.status(500).send("Error generando token");
  }
});
