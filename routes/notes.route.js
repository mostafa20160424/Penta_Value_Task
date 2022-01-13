const router = require("express").Router()
const UploadFiles = require("../middleware/upload/UploadMedialFiles")

module.exports = (sequelize, io, connectedUsers) => {

const NotesController = require("../controllers/notes.controller") (sequelize, io, connectedUsers)
const UploadErrorHandler = require("../middleware/upload/handleUploadError")

// @desc    Send Note To One Or Many User
// @route   Get /api/notes/send
// @access  Public
router.post('/send', (req, res, next) =>
 UploadFiles(req, res, next, (err) => UploadErrorHandler(err, req, res, next)),
 NotesController.sendNote)

router.post('/send', NotesController.sendNote)

// @desc    Delete One Or More Notes For Specific User
// @route   Delete /notes/delete
// @access  Public
router.delete('/delete', NotesController.DeleteNote)

// @desc    Get Notes Last Month
// @route   Get /notes/last_month
// @access  Public
router.get('/last', NotesController.NotesLastMonth)

// @desc    Get Notes For User
// @route   Get /notes/last_month
// @access  Public
router.get('/get/:user_id', NotesController.getUserNotes)

return {router, getLastNotesStats: NotesController.getLastNotesStats}

}
