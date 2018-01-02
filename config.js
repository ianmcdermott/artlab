'use strict'
exports.DATABASE_URL =
	process.env.DATABASE_URL ||
	global.DATABASE_URL ||
	'mongodb://localhost/desktop/p5js/artapp';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || '!Hop3Nobody5eesThis';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

exports.TEST_DATABASE_URL = 'mongodb://localhost/desktop/p5js/artapp/test';
