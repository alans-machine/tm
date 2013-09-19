(function(tm, undefined){
    function Tape(symbol, options){
	this.symbol = symbol
	this.options = options
	this._left = undefined;
	this._right = undefined;
    }
    Tape.prototype.read = function(){
	return this.symbol;
    };
    Tape.prototype.write = function(symbol){
	this.symbol = (symbol || this.options.blank);
    };
    Tape.prototype.left = function(){
	if (this._left === undefined) {
	    this._left = new Tape(this.options.blank, this.options);
	    this._left._right = this;
	}
	return this._left;
    };
    Tape.prototype.right = function(){
	if (this._right === undefined) {
	    this._right = new Tape(this.options.blank, this.options);
	    this._right._left = this;
	}
	return this._right;
    };

    function tapeWith(word, options) {
	if (word.length === 0){
	    return new Tape(options.blank, options);
	} else {
	    var head = new Tape(word.slice(0,1), options);
	    var rest = tapeWith(word.slice(1), options);
	    head._right = rest;
	    rest._left = head;
	    return head;
	}
    }

    function Head(word, options) {
	this.defaults = { blank: '', 'L': 'left', 'R': 'right' };
	util.merge(this.defaults).and(options);
	this.tape = tapeWith(word || this.defaults.blank, this.defaults);
    };
    Head.prototype.read = function(){
	return this.tape.read();
    };
    Head.prototype.write = function(symbol){
	return this.tape.write(symbol);
    };
    Head.prototype.left = function(){
	this.tape = this.tape.left();
	return this;
    };
    Head.prototype.right = function(){
	this.tape = this.tape.right();
	return this;
    };
    Head.prototype.execute = function(instruction){
	this.write(instruction.write);
	this[this.defaults[instruction.move]].call(this);
    };

    tm.tape = function(word, options){
	return new Head(word, options);
    };
})(tm);
