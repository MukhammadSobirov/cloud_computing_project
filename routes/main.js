const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const MainController = require('../controllers/main_C');
const middlewares = require('../middlewares/middlewares');
const notesController = require("../controllers/notes_C");

router.get('/main/:user_id', middlewares.isLoggedIn, middlewares.isAccountOwner, MainController.getMain);

router.post('/main/:user_id/wallet', middlewares.isLoggedIn, middlewares.isAccountOwner,  MainController.postWallet);

router.get('/main/:user_id/wallet/:wallet_id', middlewares.isLoggedIn, middlewares.isAccountOwner, MainController.getEdit);
router.put('/main/:user_id/wallet/:wallet_id', middlewares.isLoggedIn, middlewares.isAccountOwner, MainController.updateWallet);

router.get('/main/:user_id/wallet/:wallet_id/:name', middlewares.isLoggedIn, middlewares.isAccountOwner, MainController.showWallet);

router.delete('/main/:user_id/wallet/:wallet_id', middlewares.isLoggedIn, middlewares.isAccountOwner, MainController.deleteWallet);

//* Notes and ideas *// 
router.get('/main/:user_id/notes', middlewares.isLoggedIn, middlewares.isAccountOwner, notesController.getNotes);
router.post('/main/:user_id/notes', middlewares.isLoggedIn, middlewares.isAccountOwner, notesController.postNotes)
router.put('/main/:user_id/notes/:note_id', middlewares.isLoggedIn, middlewares.isAccountOwner, notesController.updateNotes)
router.delete('/main/:user_id/notes/:note_id', middlewares.isLoggedIn, middlewares.isAccountOwner, notesController.deleteNote)


module.exports = router