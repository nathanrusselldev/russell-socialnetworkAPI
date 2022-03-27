const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser
} = require('../../controllers/userController');


router.route('/').get(getUsers).post(createUser).delete(deleteUser)

router.route('/:userId').get(getSingleUser).delete(deleteUser);

module.exports = router