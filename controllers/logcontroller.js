const Express = require('express');
const router = Express.Router();
// const {UniqueConstraintError} = require("sequelize/lib/errors");

let validateJWT = require("../middleware/validate-jwt");

// IMPORT LOG MODEL 
const { LogModel } = require('../models');
router.get('/practice', validateJWT, (req, res) => {
  res.send('Hey! This is a practice route, yo.')
});

/*i
===============
LOG CREATE
===============
Allow users to log their workouts with included information of description, definition, result, and owner parameters.
*/
router.post("/create", validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.log;
  const { id } = req.user;
  const entry = {
    description,
    definition,
    result,
    owner_id: id
  };
  try {
    const newEntry = await LogModel.create(entry);
    res.status(200).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err });
  }
  LogModel.create(entry);
});

/* 
====================
Get All WL Entries
====================
*/
router.get("/", async (req, res) => {
  try {
    const entries = await LogModel.findAll();
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
/* 
==========================
Get Logs by User 
==========================
*/
router.get("/mine", validateJWT, async (req, res) => {
  let { id } = req.user;
  try {
    const userLogs = await LogModel.findAll({
      where: {
        owner: id
      }
    });
    res.status(200).json(userLogs);
  } catch (err) {
    res.status(500).json({error: err });
  }
});

router.get('/log', (req, res) => {
  res.send("This is the log route.");
})

router.get('/user', (req, res) => {
  res.send("this is the user route.");
})

/* 
==================
Update a Workout Log Entry
==================
*/
router.put("/update/:logId", validateJWT, async(req, res) => {
  const { title, date, entry } = req.body.journal;
  const logId = req.params.logId;
  const userId = req.user.id;
  
  const query = {
    where: {
      id: logId,
      owner: userId
    }
  };
  
  const updatedLog = {
    description: description,
    definition: definition,
    log: log
  };
  
  try {
    const update = await LogModel.update(updatedLog, query);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*
==================
Delete a WL Entry
==================
*/

router.delete("/delete/:id", validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const logId = req.params.id;

  try {
    const query = {
      where: {
        id: logId,
        owner: ownerId
      }
    };

    await LogModel.destroy(query); 
    res.status(200).json({ message: "Workout Log Entry Removed" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
})


module.exports = router;