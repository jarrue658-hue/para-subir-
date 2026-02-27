require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path"); // 1. Agregamos este módulo

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 2. USAR RUTA ABSOLUTA: Esto soluciona definitivamente el "Cannot GET /"
app.use(express.static(path.join(__dirname, "public"))); 

// Ruta para forzar la carga del index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

// 3. EXPORTAR PARA VERCEL: Esto es vital para que reconozca el servidor
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
