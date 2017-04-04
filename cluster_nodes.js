#!/usr/bin/env node
'use strict';

var nodes = [];

module.exports = {
  add: function (new_node) {
    const index = nodes.indexOf(new_node);
    if (index>-1)
      return -1; // record exists
    return nodes.push(new_node);
  },
  del: function (target_node) {
    const index = nodes.indexOf(target_node);
    if (index>-1)
      return nodes.splice(index, 1);
    return -1;
  },
  get: {
    master: function () {
      if (nodes.length > 0)
        return nodes[0];
      return -1;
    },
    nodes: function() {
      return nodes.slice();
    }
  }
};