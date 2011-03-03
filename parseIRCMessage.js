function parseIRCMessage (text) {
	var fg = 0;
	var bg = 0;
	var fl = 0;
	var ss = text.split(parseIRCMessage.re);
	var ret = [];
	var state = {};
	for (var i = 0, len = ss.length; i < len; i++) {
		text = ss[i];
		if (!text) continue;
		var type = text.charCodeAt(0);
		switch (type) {
			case 0x02:
				state.bold = !state.bold; break;
			case 0x03:
				var fgbg = text.slice(1).split(',');
				if (fgbg[0]) {
					state.fg = parseIRCMessage.mIRCColors[+fgbg[0]] || +fgbg[0];
				} else {
					delete state.fg;
				}
				if (fgbg[1]) {
					state.bg = parseIRCMessage.mIRCColors[+fgbg[1]] || +fgbg[1];
				} else {
					delete state.bg;
				}
				break;
			case 0x04:
				switch (text.charCodeAt(1)) {
					case 0x61: state.blink = !state.blink; break;
					case 0x62: state.underline = !state.underline; break;
					case 0x63: state.bold = !state.bold; break;
					case 0x64: state.reverse = !state.reverse; break;
					case 0x65: state.indent = !state.indent; break;
					case 0x67: state = {}; break;
					case 0x68: state.clrtoeol = !state.clrtoeol; break;
					case 0x69: state.monospace = !state.monospace; break;
					case 0x29: break;
					default:
						if (text.charCodeAt(2)) state.fg = text.charCodeAt(2);
						if (text.charCodeAt(3)) state.bg = text.charCodeAt(3);
				}
				break;
			case 0x06:
				state.blink = !state.blink; break;
			case 0x0f:
				state = {}; break
			case 0x16:
				state.reverse = !state.reverse; break;
			case 0x1b:
				// TODO ansi
				break;
			case 0x1f:
				state.underline = !state.underline; break;
			default:
				var attr = {};
				for (var key in state) if (state.hasOwnProperty(key)) {
					attr[key] = state[key];
				}
				ret.push({ attr : attr, text : text });
		}
	}

	return ret;
}
parseIRCMessage.types = [
	'\u0002',
	'\u0003(?:[0-9]?[0-9](?:,[0-9]?[0-9])?)?',
	'\u0004(?:[\u0060-\u0069\u0029]|..)',
	'\u0006',
	'\u000f', // remove all
	'\u0016', // reverse
	'\u001b[0-9]?[0-9]m', // ansi
	'\u001f'  // underline
];
parseIRCMessage.mIRCColors = {
	0: "white", //white
	1: "black", //black
	2: "blue", //blue (navy)
	3: "green", //green
	4: "red", //red
	5: "brown", //brown (maroon)
	6: "purple", //purple
	7: "orange", //orange (olive)
	8: "yellow", //yellow
	9: "lime", //light green (lime)
	10: "teal", //teal (a green/blue cyan)
	11: "cyan", //light cyan (cyan) (aqua)
	12: "royal", //light blue (royal)
	13: "pink", //pink (light purple) (fuchsia)
	14: "grey", //grey
	15: "silver" //light grey (silver)
};
parseIRCMessage.re = new RegExp('(' + parseIRCMessage.types.join('|') + ')', 'g');

this.parseIRCMessage = parseIRCMessage;
