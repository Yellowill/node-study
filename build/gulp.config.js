var PATH_SRC = './src/'; 
var PATH_DIST='./dist/ftb-web/';
var PATH_FILES=PATH_DIST+'**';

var PATH = {
    src:PATH_SRC,
    dist:PATH_DIST,
    dist_files: PATH_FILES,
    html:{
        src: PATH_SRC + '/**/*.html',  
        dist: PATH_DIST
    },
    css:{
        src: PATH_SRC + '/**/*.css',  
        dist: PATH_DIST
    },
    js:{
        src: PATH_SRC + '/**/*.js',  
        dist: PATH_DIST
    },
    jsMin:{
        src: PATH_SRC + '/template/res/**/*.js',  
        dist: PATH_DIST+'/template/res/',  
    },
    img:{
        src: PATH_SRC + '/**/*.{png,jpg,gif,ico}',  
        dist: PATH_DIST
    },    html:{
        src: PATH_SRC + '/**/*.html',  
        dist: PATH_DIST
    },
    css:{
        src: PATH_SRC + '/**/*.css',  
        dist: PATH_DIST
    },
    js:{
        src: PATH_SRC + '/**/*.js',  
        dist: PATH_DIST
    },
    jsMin:{
        src: PATH_SRC + '/template/res/**/*.js',  
        dist: PATH_DIST+'/template/res/',  
    },
    img:{
        src: PATH_SRC + '/**/*.{png,jpg,gif,ico}',  
        dist: PATH_DIST
    },
    fonts:{
        src:PATH_SRC+'/**/*.{eot,svg,ttf,woff}',
        dist: PATH_DIST
    },
    other:{
        src: PATH_SRC + '/**/*.{swf,xap,json}',  
        dist: PATH_DIST
    }
};
module.exports = PATH;