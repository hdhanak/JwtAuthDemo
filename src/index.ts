const express = require('express')
import { NextFunction } from 'express';
import { updateNamespaceExportDeclaration } from 'typescript';
import connects from './db/db';
import router from './router/router';

console.log(typeof(express),'express');

const i18next = require('i18next');
const i18nextMiddleware1 = require('i18next-express-middleware'); //deprected
const i18nextMiddleware = require('i18next-http-middleware');

const Backend = require('i18next-node-fs-backend');

var passport = require('passport')

const port = 8000 || process.env.PORT

express.application.prefix = express.Router.prefix = function (path:any ,configure:any) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};
const app = express()
var cookies = require("cookie-parser");
app.use(cookies());

app.use(express.json())
app.use(passport.initialize())
app.use('/',router)


connects()

app.listen(port, () => {
    console.log(`port listining a ${port}`);

})




