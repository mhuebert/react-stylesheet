"use strict";

var RootCommunication = require('./RootCommunication');
var StylesheetImage   = require('./StylesheetImage');

var ReactStylesheetMixin = {

  getRootComponent: RootCommunication.getRootComponent,

  getImages: function() {
    var stylesheets = this.getStylesheets();
    var images = [];

    for (var i = 0, len = stylesheets.length; i < len; i++) {
      images.push({
        href: stylesheets[i],
        node: document.head.querySelector('link[href="' + stylesheets[i] + '"]')
      });
    }

    return images;
  },

  ensureImagesMounted: function() {
    var images = this.getImages();

    for (var i = 0, len = images.length; i < len; i++) {
      if (!images[i].node) {
        var node = StylesheetImage.createNode(images[i].href);
        insertImage(node);
      }
    }
  },

  componentWillMount: function() {
    var stylesheets = this.getStylesheets();
    var root = this.getRootComponent();
    var registry = root.__stylesheets = root.__stylesheets || {};

    for (var i = 0, len = stylesheets.length; i < len; i++) {
      registry[stylesheets[i]] = true;
    }
  },

  componentDidMount: function() {
    this.ensureImagesMounted();
  },

  componentDidUpdate: function() {
    this.ensureImagesMounted();
  },
};

/**
 * Insert stylesheet image into document's head as a link node in a
 * "deterministic" order.
 *
 * @param {DOMNode} node
 */
function insertImage(node) {
  var images = document.head.querySelectorAll('link[data-react-stylesheet]');
  if (images.length === 0) {
    if (document.head.firstChild) {
      document.head.insertBefore(node, document.head.firstChild);
    } else {
      document.head.appendChild(node);
    }
  } else {
    var last = images[images.length - 1];
    if (last.nextSibling) {
      document.head.insertBefore(node, last.nextSibling);
    } else {
      document.head.appendChild(node);
    }
  }
}

module.exports = ReactStylesheetMixin;
