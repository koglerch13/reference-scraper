/*jshint esversion: 6 */
var scraper = require('website-scraper');
var _ = require('lodash');
var fs = require('fs');
var ProgressBar = require('progress');
var colors = require('colors/safe');

var file;
var source;
var destination = './results';
var errors = [];

//get the arguments
//first argument: text-file; second argument: optional->Destination
args = process.argv.slice(2);

if(args[0] === '?' || !args[0]) { //just some help....
    console.log(colors.bold('Reference Scraper v0.1'));
    console.log('scraper <path to sourcefile> [path to destination folder]');
    process.exit();
}

if(args[1]) {//parse a destination, if there is any
    destination = args[1];
    if(destination.endsWith('/')) {
        destination = destination.slice(0, -1);
    }
}

source = args[0];


//read the file
try {
    file = fs.readFileSync(source, 'utf8');
} catch (error) {
    console.log(colors.red(error));
    process.exit();
}

//parse links and names
var lines = _.filter(file.split('\n'), (o) => {
   return o !== '';
});

if(lines.length === 0) {
    console.log(colors.red('Error: There were no valid entries found :-('));
    console.log('Maybe your file does not have the correct format?');
}

var done = _.after(lines.length, () => {
    _(errors).forEach((value) => {
        console.log(colors.red(value));
    });
    console.log(colors.green('Process completed'));
});

var bar = new ProgressBar('[:bar] :percent', {total: lines.length,width: 50});

var regEx = /\[(.*)\].* (http.*)\(/;

_(lines).forEach((value, key) => {
    var res = regEx.exec(value);
    var name;
    var url;
    try {
        name = res[1];
        url = res[2];
    } catch(error) {
        errors.push('Error: An invalid entry was found');
        bar.tick();
        done();
        return;
    }
    var options = {
        urls: [url],
        directory: destination + '/' + name
    };
    scraper.scrape(options, (error, result) => {
        if(error) errors.push(error); 
        bar.tick();
        done();
    });
});
