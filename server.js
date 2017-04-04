#!/usr/bin/env node
'use strict';

const HEALTH_CHECK_PERIOD_MS = 1000;
const SERVER_PORT = 5000;

//const json_path = 'data/nodes.json';
//const fs = require('fs');
const cluster_nodes = require('./cluster_nodes');
const ping = require('ping');
const restify = require('restify');

//fs.access(json_path, 
//          fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK,
//          (err) => {
//  if (err===null) {
//    try {
//      nodes = JSON.parse(fs.readFileSync(json_path));
//    }
//    catch (ex) {
//      console.log(ex)
//    }
//  }
//});


function health_check() {
  cluster_nodes.get.nodes().forEach(function(node) {
    const found = node.match(/\d+\.\d+\.\d+\.\d+/);
    if (found != null) {
      const ip = found[0];
      ping.sys.probe(ip, function(isAlive){
        if(!isAlive) {
          console.log('ping failed, remove ' + ip);
          cluster_nodes.del(node);
        }
      });
    }
  });
}

function respond(req, res, next) {
  const method = req.method;
  const name = req.params.name;
  const path = req.path();
  switch (method) {
    case 'GET':
      switch (path) {
        case '/master':
          res.send(200, cluster_nodes.get.master());
          break;
        case '/nodes':
          res.send(200, cluster_nodes.get.nodes());
          break;
      }
      break;
    case 'POST':
      var success = cluster_nodes.add(name);
      res.send(success==-1?400:201, success);
      break;
    case 'DELETE':
      var success = cluster_nodes.del(name);
      res.send(success==-1?404:202, success);
      break;
  }
  console.log("[" + method + "]: "+ name);
  next();
}

// Start server
var server = restify.createServer();
server.pre(restify.pre.userAgentConnection());
server.get('/master', respond);
server.get('/nodes', respond);
server.post('/nodes/:name', respond);
server.del('/nodes/:name', respond);

setInterval(health_check, HEALTH_CHECK_PERIOD_MS);
server.listen(SERVER_PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
