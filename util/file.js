const fs = require("fs");

const deleteFile = async((filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
});

exports.deleteFile = deleteFile;
