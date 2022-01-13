const multer = require('multer')
const path = require("path");

const multi_upload = multer({
    storage:multer.diskStorage({
        limits: { fileSize: (1 * 1024 * 1024) + ((1024*1024*0.7))}, // 1.7MB
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname, "../../public/media"));
        },
        filename: (req, file, cb) => {
            image = Date.now() + "-" + file.originalname
            if(!req.resultString) {
                req.resultString += "," + image 
    
            } else {
                req.resultString = image
            }
    
            cb(null, image);
          },
      })
}).array('mediaFiles')

module.exports = multi_upload