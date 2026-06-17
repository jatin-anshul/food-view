const express  = require("express");
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})

/* post  /api/food/   {protected}*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood);


// GET /api/food/   [public]
router.get('/',
    foodController.getFoodItems
)

// GET /api/food/search?q=...  [public]
router.get('/search',
    foodController.searchFood
)

// GET /api/food/saved  [protected - user or food partner]
router.get('/saved',
    authMiddleware.authAnyMiddleware,
    foodController.getSavedFood
)

// GET /api/food/my-interactions  [protected - user or food partner]
router.get('/my-interactions',
    authMiddleware.authAnyMiddleware,
    foodController.getMyInteractions
)


router.post('/like',
    authMiddleware.authAnyMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.authAnyMiddleware,
    foodController.saveFood
)

// POST /api/food/comment  — add a comment [protected - user]
router.post('/comment',
    authMiddleware.authUserMiddleware,
    foodController.addComment
)

// GET /api/food/:foodId/comments  — fetch comments [public]
router.get('/:foodId/comments',
    foodController.getComments
)

// DELETE /api/food/comment/:commentId  — user or food partner
router.delete('/comment/:commentId',
    authMiddleware.authAnyMiddleware,
    foodController.deleteComment
)


module.exports = router;