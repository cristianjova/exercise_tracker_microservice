const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const { check, validationResult } = require('express-validator');

// Import model
const User = require('../../models/User');

// @route POST /api/exercise/new-user
// Desc   Create new user
router.post(
  '/new-user',
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
    const shortId = shortid.generate();

    try {
      let user = await User.findOne({ username });

      if (user) {
        res.json({ username: user.username, _id: user.shortId });
      } else {
        user = new User({
          username,
          shortId
        });

        await user.save();

        res.json({ username: user.username, _id: user.shortId });
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
  let users = await User.find(
    {},
    {
      _id: 0,
      __v: 0
    }
  );
  let usersClean = [];
  users.map(user => {
    usersClean.push({ username: user.username, _id: user.shortId });
  });
  res.json(usersClean);
});

module.exports = router;
