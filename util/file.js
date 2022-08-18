const fs = require("fs");

const deleteFile = async (filePath) => {
  try {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteFile = deleteFile;
