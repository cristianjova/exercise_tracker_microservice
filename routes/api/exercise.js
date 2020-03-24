express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const moment = require('moment');

// Import Model
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');

// @route POST /api/exercise/add
// Desc   Create new user exercise
router.post(
  '/add',
  [
    check('userId', 'Please include a userId')
      .not()
      .isEmpty(),
    check('description', 'Please include a description')
      .not()
      .isEmpty(),
    check('duration', 'Please include a duration')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    // Check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userId, description, duration, date } = req.body;

    // Validate date
    const validDate = new Date(date);
    if (date !== undefined && validDate.toString() === 'Invalid Date') {
      return res.json({ error: 'Invalid Date, use YYYY-MM-DD' });
    }

    try {
      const user = await User.findOne({ shortId: userId });
      if (!user) {
        res.json({ error: 'UserId is not valid' });
      } else {
        let datenow = new Date(Date.now());
        datenow = moment(datenow).format('YYYY-MM-DD');
        exercise = new Exercise({
          userId: user._id,
          description,
          duration,
          date: date === undefined ? datenow : date
        });

        await exercise.save();
        res.json(exercise);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server error');
    }
  }
);

// @route GET /api/exercise/log/:userId?[from]&[to]&[limit]
// Desc   Get all users exercise by id
router.get('/log/:userId', async (req, res) => {
  const { userId } = req.params;
  let { from, to, limit } = req.query;

  try {
    // Find user
    const user = await User.findOne({ shortId: userId });

    if (user) {
      // If passes from & to dates
      if (
        from !== undefined &&
        to !== undefined &&
        (!moment(from, 'YYYY-MM-DD', true).isValid() ||
          !moment(to, 'YYYY-MM-DD', true).isValid())
      ) {
        // Invalid dates format
        return res
          .status(422)
          .json({ error: 'Invalid from or to dates, use YYYY-MM-DD' });
      } else if (from !== undefined && to !== undefined) {
        // Filter between dates
        if (new Date(from) > new Date(to)) {
          return res.json({
            msg: 'to date must be mayor or equal to from'
          });
        }
        try {
          if (limit && isNaN(limit)) {
            return res.status(422).json({ error: 'Limit must be a number' });
          }

          let exercises = await Exercise.find(
            {
              userId: user._id,
              date: { $gte: new Date(from), $lte: new Date(to) }
            },
            {
              __v: 0
            }
          ).limit(parseInt(limit));
          res.json(exercises);
        } catch (err) {
          console.log(err);
          res.status(500).json('Server Error');
        }
      } else if (from !== undefined || to !== undefined) {
        // Only passed from or to dates
        return res
          .status(422)
          .json({ error: 'You must send from and to dates' });
      } else {
        // Get all exercises for user
        try {
          if (limit && isNaN(limit)) {
            return res.status(422).json({ error: 'Limit must be a number' });
          }
          const exercises = await Exercise.find(
            { userId: user._id },
            {
              __v: 0
            }
          ).limit(parseInt(limit));
          res.json(exercises);
        } catch (err) {
          console.log(err);
          res.status(500).json('Server Error');
        }
      }
    } else {
      res.json({ error: 'User id is not valid' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
