#!/usr/bin/env node
var util = require('util');
function ok (bool, name) {
	var r = bool ? 'ok' : 'not ok';
	console.log(name ? r + " # " + name : r);
}
function is (got, expected, name) {
	got = util.inspect(got, true, 2);
	expected = util.inspect(expected, true, 2);
	if (got === expected) {
		ok(true, name);
	} else {
		ok(false, name);
		console.log("# got:\n" + got.replace(/^/m, "# "));
		console.log("# expected:\n" + expected.replace(/^/m, "# "));
	}
}

var parseIRCMessage = require('./parseIRCMessage.js').parseIRCMessage;

is(parseIRCMessage("foobar"), [
	{ attr: {}, text: 'foobar' }
]);

is(parseIRCMessage("\x030foobar"), [
	{ attr: { fg: 'white' }, text: 'foobar' }
], "mIRC white");

is(parseIRCMessage("\x0399foobar"), [
	{ attr: { fg: 99 }, text: 'foobar' }
], "mIRC 99");

is(parseIRCMessage("\x030,0foobar"), [
	{ attr: { fg: 'white', bg: 'white' }, text: 'foobar' }
], "mIRC 0,0");

is(parseIRCMessage("\x030,99foobar"), [
	{ attr: { fg: 'white', bg: 99 }, text: 'foobar' }
], "mIRC 0,99");

is(parseIRCMessage("\x030foobar\x03foobar"), [
	{ attr: { fg: 'white' }, text: 'foobar' },
	{ attr: {}, text: 'foobar' }
], "mIRC white");

is(parseIRCMessage("\x030foobar\x030,0foobar"), [
	{ attr: { fg: 'white' }, text: 'foobar' },
	{ attr: { fg: 'white', bg: 'white' }, text: 'foobar' }
], "mIRC white");
