(function(tm, undefined){
    function Machine(word, rulebook, startState){
	this._head = new tm.tape(word);
	this._stateMachine = new tm.StateMachine(rulebook, startState);
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
	    this._head.execute(instruction);
	    this._stateMachine.execute(instruction);
	    n--;
	}
    }

    tm.Machine = Machine;
})(tm);
