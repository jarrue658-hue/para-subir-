require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Sirve los archivos de la carpeta public (soluciona el "Cannot GET /")
app.use(express.static("public")); 

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/enviar-reporte", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  try {
    // 1. Correo para ti (notificación)
    await transporter.sendMail({
      from: `"Sistema" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nuevo incidente: ${asunto}`,
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${mensaje}</p>
      `
    });

    // 2. Correo para el usuario (confirmación)
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hemos recibido tu reporte",
      html: `<p>Hola ${nombre}, recibimos tu reporte correctamente.</p>`
    });

    res.json({ mensaje: "Reporte enviado correctamente ✅" });

  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ error: "Error al enviar el correo ❌" });
  }
});

// MODIFICACIÓN CLAVE PARA RENDER:
// Reemplaza tu app.listen(3000...) por este:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});