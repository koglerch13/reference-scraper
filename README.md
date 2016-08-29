#Reference Scraper
An application to automatically download referenced websites.
Created to spare me of the task of manually downloading every single website that was referenced for my bachelors thesis.

##Install
Extract, change to ./app and run `npm install`

##Run
Run `scraper <sourcefile> [destination folder]`

###Parameters
**Sourcefile**
The file that contains URLs and reference titles. An example is provided. The sourcefile must follow the same format as the example.

**destination folder**
The name of the folder that the results will be saved into. Defaults to _./results_