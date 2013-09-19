describe('stateMachine', function(){
    var rulebook = {
	's1' : {
	    'a' : { nextState : 's1', write: 'a', move: 'R' },
	    'b' : { nextState : 's2', write: 'a', move: 'L' }
	},
	's2' : {
	    'a' : { nextState : 's2', write: 'a', move: 'L' },
	    'b' : { nextState : 's3', write: 'b', move: 'R' }
	}
    };

    it('should have a current state', function(){
	var stateMachine = new tm.StateMachine(rulebook, 's1');

	expect(stateMachine.currentState()).toBe('s1');
    });

    it('should return an instruction depending on symbol', function(){
	var stateMachine = new tm.StateMachine(rulebook, 's1');

	var instruction = stateMachine.instructionFor('a');

	expect(instruction.nextState).toBe('s1');
	expect(instruction.write).toBe('a');
	expect(instruction.move).toBe('R');
    });


    it('should execute an instruction', function(){
	var stateMachine = new tm.StateMachine(rulebook, 's1');
	var instruction = { nextState : 's2', write: 'a', move: 'L' };

	stateMachine.execute(instruction);

	expect(stateMachine.currentState()).toBe('s2')
    });
});
