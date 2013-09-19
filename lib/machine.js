(function(tm, undefined){
    function Machine(word, rulebook, startState){
	this._head = new tm.tape(word);
	this._stateMachine = new tm.StateMachine(rulebook, startState);
	this._error = false
    };
    Machine.prototype.currentState = function(){
	return this._stateMachine.currentState();
    };
    Machine.prototype.read = function(){
	return this._head.read();
    };
    Machine.prototype.step = function(n){
	n = n || 1;
	while (n > 0) {
	    var instruction = this._stateMachine.instructionFor(this.read());
	    if (instruction) {
		this._head.execute(instruction);
		this._stateMachine.execute(instruction);
	    } else {
		this._error = true;
	    }
	    n--;
	}
    }
    Machine.prototype.error = function(){
	return this._error;
    }

    tm.Machine = Machine;
})(tm);
