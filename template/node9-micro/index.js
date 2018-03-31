"use strict";

// const express = require("express");
// const app = express();
const Router = require("micro-http-router"),
  router = new Router({ debug: true }),
  handler = require("./function/handler");

class FunctionEvent {
  constructor(req) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
  }
}

class FunctionContext {
  constructor(cb) {
    this.value = 200;
    this.cb = cb;
    this.headerValues = {};
  }

  status(value) {
    if (!value) {
      return this.value;
    }

    this.value = value;
    return this;
  }

  headers(value) {
    if (!value) {
      return this.headerValues;
    }

    this.headerValues = value;
    return this;
  }

  succeed(value) {
    let err;
    this.cb(err, value);
  }

  fail(value) {
    let message;
    this.cb(value, message);
  }
}

var middleware = (req, res) => {
  let cb = (err, functionResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    if (isArray(functionResult) || isObject(functionResult)) {
      res
        .set(fnContext.headers())
        .status(fnContext.status())
        .send(JSON.stringify(functionResult));
    } else {
      res
        .set(fnContext.headers())
        .status(fnContext.status())
        .send(functionResult);
    }
  };

  let fnEvent = new FunctionEvent(req);
  let fnContext = new FunctionContext(cb);

  handler(fnEvent, fnContext, cb);
};

router.post("/", middleware);
router.get("/", middleware);

// const port = process.env.http_port || process.env.port || 3000;

// app.listen(port, () => {

// });

let isArray = a => {
  return !!a && a.constructor === Array;
};

let isObject = a => {
  return !!a && a.constructor === Object;
};
