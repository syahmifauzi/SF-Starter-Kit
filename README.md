# SF-Starter-Kit
A starter kit for frontend workflow using [GulpJS](http://gulpjs.com/) with [Nunjucks](https://mozilla.github.io/nunjucks/) + [Jade](http://jade-lang.com/) Template Engines, Yaml Front-Matter, [SASS/SCSS](http://sass-lang.com/)(AutoPrefixer) and [BrowserSync](https://www.browsersync.io/).


## System Preparation
To use this starter project, you'll need the following things installed on your machine.   
1. [NodeJS](http://nodejs.org) - use the installer.
2. [GulpJS](https://github.com/gulpjs/gulp) - run `$ npm install -g gulp` in console (mac users may need sudo)


## Local Installation
1. Clone this repo, or download it into a directory of your choice.
2. `$ cd` inside the directory, run `$ npm install`.


## Usage
**Development & Production Modes**   
In shell, run :
```shell
$ gulp
```
This will give you file watching, browser synchronisation, CSS injecting etc etc..   

Need help? Run :
```shell
$ gulp help
```
This will log all gulp commands that you can use.


## Folder Structure
After run `$ gulp` in console, initial folder structure might look like below. Note that everything for production will be build in 'build/'(output) folder. You can change the output destination in config.json and make sure you re-run `$ gulp`.
```css
SF-Starter-Kit/
    |- app/
        |- assets/
            |- css/**/*
            |- img/**/*
            |- js/**/*
        |- pages/
            |- _jadefiles/
            |- includes/
            |- otherPage/index.nunjucks
            |- posts/ <-- TODO
            |- index.nunjucks
            |- 404.nunjucks
        |- templates/
            |- macros/
            |- partials/base.nunjucks
            |- default.nunjucks
        |- data.json
        |- favicon.ico
    |- build/
        |- assets/
            |- css/**/*
            |- img/**/*
            |- js/**/*
        |- otherPage/index.html
        |- 404.html
        |- favicon.ico
        |- index.html
    |- node_modules/**/*
    |- .gitignore
    |- config.json
    |- gulpfile.js
    |- package.json
    |- README.md
```


**TODO :**
- Integrate this starter kit with blog-posts.
- FiX Markdown Task in gulpfile.js
