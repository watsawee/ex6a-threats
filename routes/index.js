var express = require('express');
var router = express.Router();

const request = require('request');

const heroesService = 'http://localhost:3001';

const threats = [
  {
      id: 1,
      displayName: 'Pisa tower is about to collapse.',
      necessaryPowers: ['flying'],
      img: 'tower.jpg',
      assignedHero: 0
  },
  {
      id: 2,
      displayName: 'Engineer is going to clean up server-room.',
      necessaryPowers: ['teleporting'],
      img: 'mess.jpg',
      assignedHero: 0
  },
  {
      id: 3,
      displayName: 'John will not understand the joke',
      necessaryPowers: ['clairvoyance'],
      img: 'joke.png',
      assignedHero: 0
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/threats', function(req, res) {
  console.log('Returning threats list');
  res.send(threats);
});

router.put('/assignment', function(req, res) {
  request.put({
      url: heroesService+"/hero",
      body: {'busy': false},
      json: true
  }, (err, heroResponse, body) => {
      console.log("hello delete xxxxx");
      if (!err) {
        for(i=0; i<threats.length; i++){
            threats[i].assignedHero = 0;
        }
        res.send(threats);
      } else {
        res.status(400).send();
      }
  });
});

router.post('/assignment', function(req, res) {
  request.post({
      url: heroesService+"/hero/"+req.body.heroId,
      body: {'busy': true},
      json: true
  }, (err, heroResponse, body) => {
      if (!err) {
          const threatId = parseInt(req.body.threatId);
          const threat = threats.find(elm => elm.id === threatId);
          threat.assignedHero = req.body.heroId;
          res.status(202).send(threat);
      } else {
          res.status(400).send({problem: "Hero Service responded with issue "+err});
      }
  });
});

module.exports = router;
