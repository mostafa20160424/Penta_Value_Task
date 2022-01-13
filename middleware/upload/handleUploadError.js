const multer = require('multer')

module.exports = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(500)
        next(new Error(err))
        return;
    } else if (err) {
        // An unknown error occurred when uploading.
        if (err.name == 'ExtensionError') {
            res.status(413)
            next(new Error(err))
        } else {
            res.status(500)
            next(new Error(err))
        }
        return;
    }
    console.log("go here")
    // work fine
    return next()
}