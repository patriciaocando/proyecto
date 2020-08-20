const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const crypto = require("crypto");
const sendgrid = require("@sendgrid/mail");
const { format, formatISO9075, parse } = require("date-fns");

//ruta de archivos
const imagesPath = path.join(__dirname, process.env.UPLOAD_DIR);

function formatDate(date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}

//funcion para procesar imagenes
async function processImage(uploadImage) {
  // se crea el directorio recursivo
  await fs.mkdir(imagesPath, { recursive: true });

  //leer la imagen con sharp
  const image = sharp(uploadImage.data);

  //guardo la informacion de la imagen
  const imageInfo = await image.metadata();

  //redimensionar si es necesario
  if (imageInfo.width > 1000) {
    image.resize(1000);
  }

  //Guardar la imagen en el directorio
  const imageFileName = `${uuid.v4()}.jpg`;

  await image.toFile(path.join(imagesPath, imageFileName));

  //devolver el nuevo nombre
  return imageFileName;
}

//funcion para eliminar ficheros
async function deleteFile(uploadFile) {
  await fs.unlink(path.join(imagesPath, uploadFile));
}

//Funcion de enviar email
async function sendMail({ email, title, content }) {
  sendgrid.setApiKey(process.env.SENDGRID_KEY);

  const message = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: title,
    text: content,
    html: `
    <div>
    <h1>${title}</h1>
    <p>${content}</p>
    </div>
    `,
  };
  await sendgrid.send(message);
}

//Generar codigo aleatorio
function randomCodeString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

//Generador de errores
function errorGenerator(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

//Trasnfoma fecha sin hora en formato dd/mm/aaaa a formato ISO
function dateTransform(date) {
  const parseDate = parse(date, "yyyy-M-dd", new Date());
  const sqlDate = formatISO9075(parseDate);
  return sqlDate;
}

module.exports = {
  formatDate,
  errorGenerator,
  randomCodeString,
  sendMail,
  processImage,
  deleteFile,
  dateTransform,
};
