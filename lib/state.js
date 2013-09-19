(function(tm, undefined){
    function StateMachine(rulebook, startState){
	this._rulebook = rulebook;
	this._currentState = startState;
    };
    StateMachine.prototype.currentState = function(){
	return this._currentState;
    };
    StateMachine.prototype.instructionFor = function(symbol){
	var possibleInstructions = this._rulebook[this._currentState];
	if (possibleInstructions){
	    instruction = possibleInstructions[symbol];
	    if(instruction) {
		return instruction;
	    }
	}
    };
    StateMachine.prototype.execute = function(instruction){
	this._currentState = instruction.nextState;
    };

    tm.StateMachine = StateMachine;
})(tm);
