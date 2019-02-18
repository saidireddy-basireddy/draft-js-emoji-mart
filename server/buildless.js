"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell = require("shelljs");
const fs = require("fs");
const chalkc = require("chalk");
let chalk = chalkc;
const key = 'lessfile:';
let entry = process.argv.find(x => x.startsWith(key));
let lessFile = entry.replace('lessfile:', '');
let PathIndex = lessFile.lastIndexOf('.less');
let basePath = lessFile.slice(0, PathIndex);
let cssPath = basePath + '.css';
shell.exec(`lessc ${lessFile} ${cssPath}`);
shell.exec(`tcm -p ${cssPath}`);
fs.rename(`${cssPath}.d.ts`, `${basePath}.less.d.ts`, (err) => {
    if (err) {
        // tslint:disable-next-line:no-console
        console.log(chalk.red('error creating css module defenition', err));
    }
    else {
        fs.unlink(cssPath);
        // tslint:disable-next-line:no-console
        console.log(chalk.cyan('defenition file updated'));
    }
});
