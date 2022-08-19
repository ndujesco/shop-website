const cloudinary = require("./cloudinary.js");

const deleteFile = async (imageId) => {
  await cloudinary.uploader.destroy(imageId);
};

exports.deleteFile = deleteFile;

// const fs = require("fs");
// const fileExists = fs.existsSync("controllers/admin.js");
// console.log(fileExists);
