const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import model
const User = require('../../models/User');

// @route POST /api/exercise/new-user
// Desc   Create new user
router.post(
  '/create-user',
  [
    check('username', 'Please include a username')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()[0].msg });
    }

    const { username } = req.body;

    try {
      let user = await User.findOne({ username }).select('-__v');

      if (user) {
        res.json(user);
      } else {
        user = new User({
          username
        });

        await user.save();

        res.json(user.populate('username', '_id'));
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  }
);

// @route GET /api/exercise/users
// Desc   Get all users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-__v');
  console.log(users);
  res.json(users);
});

module.exports = router;
