(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Typomatic = factory());
}(this, function () { 'use strict';

  var Typomatic = function Typomatic(element, options) {
    this.element = element;
    this.options = Typomatic.customise(options);

    this.element.classList.add('typomatic');
    this.cursor = document.createElement('span');
    this.cursor.className = 'cursor';
    this.element.appendChild(this.cursor);

    this.queue = [];
  };

  Typomatic.customise = function customise (options) {
    var source = {
      speed: 90
    };
    for (var i in options) {
      source[i] = options[i];
    }
    return source;
  };

  Typomatic.prototype.add = function add (event) {
    this.queue.push(event);
  };
  Typomatic.prototype.next = function next () {
    var event = this.queue.shift();
    if (typeof event === 'function') {
      event(this.next.bind(this));
    }
  };
  Typomatic.prototype.type = function type (text, speed) {
      var this$1 = this;

    var event = function (done) {
      var typing = document.createElement('span');
      typing.className = 'typing';
      this$1.cursor.classList.remove('blink');
      this$1.element.insertBefore(typing, this$1.cursor);

      var tag, segment;
      var i = 0;

      var animate = function () {
        if (segment === text) {
          this$1.cursor.classList.add('blink');
          return done();
        }
        segment = text.slice(0, ++i);
        typing.innerHTML = segment;
        var char = segment.slice(-1);
        if (char === '<') { tag = true; }
        if (char === '>') { tag = false; }
        if (tag) { return animate(); }
        window.setTimeout(
          animate,
          speed || this$1.options.speed
        );
      };

      animate();
    };

    this.add(event);
    return this;
  };
  Typomatic.prototype.exec = function exec (code) {
    var event = function (done) {
      code();
      return done();
    };

    this.add(event);
    return this;
  };
  Typomatic.prototype.done = function done () {
    return this.next();
  };

  return Typomatic;

}));
