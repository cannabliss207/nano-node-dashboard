var express = require('express');
var router = express.Router();

var async = require('async');

const RaiClient = require('node-raiblocks-rpc');
const NODE_ADDRESS = process.env.NODE_ADDRESS || 'http://[::1]:7076';
const client = new RaiClient(NODE_ADDRESS, true);

/* GET users listing. */
router.get('/block_count', function(req, res, next) {
  client
  .block_count()
  .then(count => {
    res.send(count);
  })
  .catch(e => {
    res.send(e);
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  var obj = ['version', 'block_count', 'peers'];
  var data = {};

  async.forEachOf(obj, (value, key, callback) => {
    console.log(value);
    client._send(value)
    .then(clientdata => {
      data[value] = clientdata;
      callback();
    })
    .catch(e => {
      callback(e);
    });
  }, err => {
    if (err) console.error(err.message);

    // strip peers to peers count
    data.peers.count = Object.keys(data.peers.peers).length;
    delete data.peers.peers;

    res.send(data);
  });
});

module.exports = router;
