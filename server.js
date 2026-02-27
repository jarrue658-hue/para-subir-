const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "incidentessolicitudespathsupoo@gmail.com",
    pass: "bhvlbqgboocjwbbp"
  }
});

app.post("/enviar-reporte", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  try {
    await transporter.sendMail({
      from: `"Sistema" <incidentessolicitudespathsupoo@gmail.com>`,
      to: "incidentessolicitudespathsupoo@gmail.com",
      replyTo: email,
      subject: `Nuevo incidente: ${asunto}`,
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${mensaje}</p>
      `
    });

    await transporter.sendMail({
      from: `"Soporte" <incidentessolicitudespathsupoo@gmail.com>`,
      to: email,
      subject: "Hemos recibido tu reporte",
      html: `<p>Hola ${nombre}, recibimos tu reporte.</p>`
    });

    res.json({ mensaje: "Reporte enviado correctamente ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar el correo ❌" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});