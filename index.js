var encoder = {
	" ": 0,
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"a": 10,
	"b": 11,
	"c": 12,
	"d": 13,
	"e": 14,
	"f": 15,
	_values: ["\u200B", "\u200C", "\u200D", "\u200E", 
			  "\u202C", "\u202D", "\u2060", "\u2062", 
			  "\u2063", "\u2064", "\u2066", "\u2069", 
			  "\u206A", "\u206B", "\u206C", "\u206D"],
	_crypto:          [0,1,2,3,4,5,6, 7,8,9,10,11,12,13,14,15],
	_crypto_null:     [0,1,2,3,4,5,6, 7,8,9,10,11,12,13,14,15],
	"\u00AD": 0,
	"\u034F": 1
}
var decoder = {
	"\u200B": 0,
	"\u200C": 1,
	"\u200D": 2,
	"\u200E": 3,
	"\u202C": 4,
	"\u202D": 5,
	"\u2060": 6,
	"\u2062": 7,
	"\u2063": 8,
	"\u2064": 9,
	"\u2066": 10,
	"\u2069": 11,
	"\u206A": 12,
	"\u206B": 13,
	"\u206C": 14,
	"\u206D": 15,
	_values: ["0", "1", "2", "3", 
			  "4", "5", "6", "7", 
			  "8", "9", "a", "b", 
			  "c", "d", "e", "f"],
	_crypto:          [0,1,2,3,4,5,6, 7,8,9,10,11,12,13,14,15],
	_crypto_null:     [0,1,2,3,4,5,6, 7,8,9,10,11,12,13,14,15],
	_crypto_inv:          [0,1,2,3,4,5, 6,7,8,9,10,11,12,13,14,15],
	"\u00AD": 0,
	"\u034F": 1
}
encoder.encode = function(e, topencode) {
	if(this._crypto[this[e]] == this._crypto[this["\u00AD"]]) return "\u00AD";
	else if(this._crypto[this[e]] == this._crypto[this["\u034F"]] && !topencode) return "\u034F";
	else return this._values[this._crypto[this[e]]];
}
encoder.toptwo = function() {
	return "" + this._values[this._crypto[this["\u00AD"]]] + this._values[this._crypto[this["\u034F"]]];
}
decoder.decode = function(e) {
	return this._values[this._crypto_inv[this[e]]];
}
function v5encode(message, secret, toplevel) {
	var c = new TextEncoder().encode(secret);
	var d = "";
	c.forEach(function(e){
		e.toString(16).padStart(2).split("").forEach(function(e){d += encoder.encode(e, toplevel);})
	});
	return message[0] + ( toplevel ?encoder.toptwo():"") + d + message.substring(1, message.length);
}
function v5decode(message, toplevel) {
	var a = [];
	var b = "";
	//var temp = "";
	var i2 = 0;
	if(toplevel) {
		while(i2<message.length) {
			if(decoder[message.charAt(i2)] != undefined) {
				decoder["\u00AD"] = decoder[message.charAt(i2)];
				decoder["\u034F"] = decoder[message.charAt(i2+1)];
				i2+=2;
				break;
			}
			i2++;
		}
	}
	for(var k = i2; k<message.length; k++) {
		if(decoder[message.charAt(k)] != undefined)
		{
			b += decoder.decode(message.charAt(k));
			//temp += decoder.decode(message.charAt(k));
			if(b.length ==  2) {
				a.push(parseInt(b, 16)); 
				b = "";
			}
		}
	}
	//console.log(temp);
	var c = new Uint8Array(a.length);
	for(i = 0; i<message.length; i++)
		c[i] = a[i];
	return new TextDecoder("utf-8").decode(c);
}
function encode(m, s, toplevel) {
	if(s == "") return m;
	return v5encode(m, s, toplevel);
}
function decode(m, toplevel) {
	return v5decode(m, toplevel);
}
function dlxencode(fieldset) {
	var areas = fieldset.getElementsByTagName("textarea");
	if(areas.length == 0) return "";
	var result = "";
	for(i = areas.length-1; i>=0; i--) {
		result = encode(areas[i].value, result, i==0);
	}
	return result;
}
function dlxdecode(input, fieldset) {
	var areas = fieldset.getElementsByTagName("textarea");
	if(areas.length == 0) return;
	areas[0].value = decode(input, true);
	for(j = 1; j<areas.length; j++) {
		areas[j].value = decode(areas[j-1].value, false);
	}
}
function changeHack() {
	document.getElementById("encodingForm").dispatchEvent(new Event('input'));
	document.getElementById("decodingForm").dispatchEvent(new Event('input'));
}
function copyToClipboard(var1){
	navigator.clipboard.writeText(var1.value);
}
function createEnbox() {
	var div = document.createElement('div');
	div.classList.add("textdiv");
	var ta = document.createElement('textarea');
	ta.classList.add("thearea");
	div.appendChild(ta);
	var rembutton = document.createElement('button');
	rembutton.innerHTML='<svg height="70" width="70">'
		+ '<defs>'
		+ '<radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">'
		+ '<stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />'
		+ '<stop offset="100%" style="stop-color:rgb(127,0,0);stop-opacity:1" />'
		+ '</radialGradient>'
		+ '</defs>'
		+ '<path d="M20 5 L 5 20 L 20 35 L 5 50 L 20 65 L 35 50 L 50 65 L 65 50 L 50 35 L 65 20 L 50 5 L 35 20 Z" stroke="black" stroke-width="4" fill="url(#grad1)" />'
		+ 'Remove'
		+ '</svg>';
	var type = document.createAttribute("type");
	type.value="button";
	rembutton.attributes.setNamedItem(type);
	rembutton.onclick=function(){
		this.parentElement.remove(); 
		document.getElementById('encodingForm').dispatchEvent(new Event('input'));
	}
	rembutton.classList.add("rembutton");
	div.appendChild(rembutton);
	return div;
}
function eninsbefore(fieldset) {
	var div = createEnbox();
	if(fieldset.children.length == 0) fieldset.appendChild(div); 
	else fieldset.insertBefore(div, fieldset.children[0]);
	document.getElementById('encodingForm').dispatchEvent(new Event('input'));
}
function eninsafter(fieldset) {
	var div = createEnbox();
	fieldset.appendChild(div); 
	document.getElementById('encodingForm').dispatchEvent(new Event('input'));
}
function deinsafter(fieldset, noupdate) {
	var div = document.createElement('div');
	div.classList.add("textdiv");
	div.attributes.setNamedItem(document.createAttribute("readonly"));
	var ta = document.createElement('textarea');
	ta.classList.add("thearea");
	ta.attributes.setNamedItem(document.createAttribute("readonly"));
	div.appendChild(ta);
	var rembutton = document.createElement('button');
	rembutton.innerHTML='<svg height="70" width="70">'
		+ '<defs>'
		+ '<radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">'
		+ '<stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />'
		+ '<stop offset="100%" style="stop-color:rgb(127,0,0);stop-opacity:1" />'
		+ '</radialGradient>'
		+ '</defs>'
		+ '<path d="M20 5 L 5 20 L 20 35 L 5 50 L 20 65 L 35 50 L 50 65 L 65 50 L 50 35 L 65 20 L 50 5 L 35 20 Z" stroke="black" stroke-width="4" fill="url(#grad1)" />'
		+ 'No SVG??'
		+ '</svg>';
	var type = document.createAttribute("type");
	type.value="button";
	rembutton.attributes.setNamedItem(type);
	rembutton.onclick=function(){
		this.parentElement.remove();
		document.getElementById('decodingForm').dispatchEvent(new Event('input'));
	}
	rembutton.classList.add("rembutton");
	div.appendChild(rembutton);
	fieldset.appendChild(div);
	if(!noupdate) document.getElementById('decodingForm').dispatchEvent(new Event('input'));
	div._ta = ta;
	return div;
}
function enreset() {
	document.getElementById('encodingForm').getElementsByTagName('fieldset')[0].innerHTML = '';
	eninsafter(document.getElementById('encodingForm').getElementsByTagName('fieldset')[0]);
}
function dereset() {
	document.getElementById('decodingForm').getElementsByTagName('fieldset')[0].innerHTML = '';
	document.getElementById('decodingForm').getElementsByTagName('textarea')[0].value = '';
	return deinsafter(document.getElementById('decodingForm').getElementsByTagName('fieldset')[0]);
}
function enforminput(enoutput, enfs, charcount, enkey) {
	enupdatekey(enkey);
	if(autoOpt) benchmark(false);
	enoutput.value=dlxencode(enfs);
	charcount.value=enoutput.value.length;
}
var deAuto = true;
function deautoToggle() {
	deAuto = !deAuto;
	document.getElementById('decodingForm').dispatchEvent(new Event('input'));
}
function deformInput(demessage, defs, dekey) {
	deupdatekey(dekey);
	if(deAuto) {
		document.getElementById("dectitle").innerText = "AutoDecoding";
		advancedDecode(demessage, defs);
	}
	else {
		document.getElementById("dectitle").innerText = "Decoding";
		dlxdecode(demessage.value, defs);
	}
}
function advancedDecode(input, fieldset) {
	fieldset.innerHTML = '';
	
	var taprev = deinsafter(fieldset, true)._ta;
	
	taprev.value = v5decode(input.value, true);
	aabc = taprev.value;
	while(taprev.value.match("[\u200B\u200C\u200D\u200E\u202A\u202D\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u206A\u206B\u206C\u034F\u00AD]")) {
	
		
		var div = deinsafter(fieldset, true);
		
		div._ta.value = v5decode(taprev.value, false);
		taprev = div._ta;
	}
	
	
}
function benchmark(standard) {
	if(standard) {
		document.getElementById("enforminput");
		document.getElementById('encodingForm').getElementsByTagName('fieldset')[0].innerHTML = '';
		eninsafter(document.getElementById('encodingForm').getElementsByTagName('fieldset')[0]);
		eninsafter(document.getElementById('encodingForm').getElementsByTagName('fieldset')[0]);
		eninsafter(document.getElementById('encodingForm').getElementsByTagName('fieldset')[0]);
		eninsafter(document.getElementById('encodingForm').getElementsByTagName('fieldset')[0]);
		var things  = document.getElementById('encodingForm').getElementsByTagName('fieldset')[0].getElementsByTagName("textarea");
		for(var i = 0; i<things.length; i++) {
			things[i].value = "The quick, brown fox jumps over the lazy dog.";
			//things[i].value = "owo";
		}
	}
	var results = [];
	encoder["\u00AD"] = 0;
	encoder["\u034F"] = 1;
	while(encoder["\u034F"]<15) {
		var fs = document.getElementById('encodingForm').getElementsByTagName('fieldset')[0];
		results.push(
			dlxencode(fs).length 
		  + " "
		  + encoder["\u00AD"].toString(16) 
		  + encoder["\u034F"].toString(16)
		 );
		encoder["\u00AD"]++;
		if(encoder["\u00AD"] == encoder["\u034F"]) encoder["\u00AD"]++;
		if(encoder["\u00AD"] >= 15) {encoder["\u00AD"] = 0; encoder["\u034F"]++;}
	}
	if(standard) console.log(results.sort());
	var fin = results.sort()[0].split(" ")[1];
	encoder["\u00AD"] = parseInt(fin[0], 16);
	encoder["\u034F"] = parseInt(fin[1], 16);
	if(standard) document.getElementById('encodingForm').dispatchEvent(new Event('input'));
}
var autoOpt = false
function toggleautoopt() {
	autoOpt = !autoOpt;
	if(autoOpt) document.getElementById("autoopt").innerText = 'Auto-Optimize: On';
	else document.getElementById("autoopt").innerText = 'Auto-Optimize: Off';
}
function deupdatekey(ta) {
	var a = ta.value.split("");
	var aa = [];
	try {
		ta.parentElement.classList.remove("invalid");
		if(ta.value == "") throw 0;
		if(ta.value.match("(\\1.).*\\1")) throw 1;
		a.forEach(function(e){
			if(parseInt(e, 16) != parseInt(e, 16)) throw 2;
			aa.push(parseInt(e, 16));
		})
		if(aa.length != 16) throw 3;
		decoder._crypto = aa;
		var ab = [];
		var keys = aa.keys();
		var vals = aa.values();
		var k = keys.next();
		while(!k.done) {
			ab[vals.next().value] = k.value;
			k = keys.next();
		}
		decoder._crypto_inv = ab;
	}
	catch(e) {
		//console.log(e);
		//console.log(ta.value)
		if(e) ta.parentElement.classList.add("invalid");
		decoder._crypto = [...decoder._crypto_null];
		decoder._crypto_inv = [...decoder._crypto_null];
	}
}
function enupdatekey(ta) {
	var a = ta.value.split("");
	var aa = [];
	try {
		ta.parentElement.classList.remove("invalid");
		if(ta.value == "") throw 0;
		if(ta.value.match("(\\1.).*\\1")) throw 1;
		a.forEach(function(e){
			if(parseInt(e, 16) != parseInt(e, 16)) throw 2;
			aa.push(parseInt(e, 16));
		})
		if(aa.length != 16) throw 3;
		encoder._crypto = aa;
	}
	catch(e) {
		//console.log(e);
		//console.log(ta.value)
		if(e) ta.parentElement.classList.add("invalid");
		encoder._crypto = [...encoder._crypto_null];
	}
}