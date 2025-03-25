const express = require("express");
const app = express();
const port = 5000;
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { PythonShell } = require("python-shell");


const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Carpeta 'uploads' creada automáticamente.");
}

const docxDir = path.join(__dirname, "docx");
if (!fs.existsSync(docxDir)) {
  fs.mkdirSync(docxDir, { recursive: true });
  console.log("Carpeta 'docx' creada automáticamente.");
}


// Configuración de Multer para manejar la carga de archivos
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

// Ruta principal para servir el archivo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta para manejar la conversión de PDF a DOCX
app.post("/pdftodocx", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Ejecutar el script de Python para convertir el archivo PDF a DOCX
  const pyshell = new PythonShell("convert_pdf_to_docx.py", {
    mode: "text",
    pythonPath: "python",
    scriptPath: __dirname,
    args: [req.file.path],
  });

  pyshell.on("message", (message) => {
    console.log(message);
  });

  pyshell.on("error", (error) => {
    console.error("Error executing Python script:", error);
    res.status(500).send("An error occurred while converting the file");
  });

  pyshell.end((err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const docxFilePath = path.join("docx", path.basename(req.file.path).replace(".pdf", ".docx"));

    // Enviar una respuesta JSON con la ruta del archivo convertido
    res.json({ message: "File converted successfully", success: true, namefile: path.basename(docxFilePath) });
  });

  console.log("PDF file path:", req.file.path);
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
