# gulpDevServer

My first gulp script to create a simple webpage with ES2015, postcss and livereload 

##install
1. git clone https://github.com/darkship/gulpDevServer.git
2. (npm install gulp -g)
3. npm install
4. add sources/js/index.js
5. define config.paths in gulpfile.js
6. Do not forget to add the references of your css and javascript into your html

## gulp commands
- html : moves html from /sources to /build/*.html
- js : builds sources/js/***/*.js with browserify to (config.path.js)/app.js (react + es2015 + sourcemaps)
- css : moves /sources/css/***/*.css to (config.path.css) 
- postcss : builds sources/postcss/***/*.css with postcss to (config.path.css)/index.css (nested + variables + autoprefixer + sourcemaps)
- build : runs html, js, css, postcss
- serve lunch local webserver with livereload on port 3000 

options :
--production : adds minify and uglify for javascript + cleans option for postcss
