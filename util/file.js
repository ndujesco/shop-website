const cloudinary = require("./cloudinary.js");

const deleteFile = async (imageId) => {
  await cloudinary.uploader.destroy(imageId);
};

exports.deleteFile = deleteFile;
