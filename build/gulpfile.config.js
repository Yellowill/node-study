var gulpConfig={
	htmlmin: { 
		removeComments: true,
		collapseWhitespace: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		minifyJS: true,
		minifyCSS: true
	},
	autofx: {   
		browsers: [
			'ie >= 9',
			'ie_mob >= 10',
			'ff >= 30',
			'chrome >= 34',
			'safari >= 7',
			'opera >= 23',
			'ios >= 7',
			'android >= 4.4',
			'bb >= 10'
		],
		cascade: true,
		remove: true
	},
	cleanCSS: {   
		compatibility: 'ie8',
		keepSpecialComments: '*'
	},
	uglify: {
		mangle: {
			except: ['require', 'exports', 'module', '$']
		}
	},
	img:{
		progressive: true, 
		optimizationLevel: 5
	}
}
module.exports =gulpConfig; 