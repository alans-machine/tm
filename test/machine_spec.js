describe('machine', function(){
    var word = 'I';
    var rulebook = {
	's1' : {
	    'I' : { nextState : 's1', write: 'I', move: 'R' },
	    '' : { nextState : 's2', write: 'I', move: 'L' }
	},
	's2' : {
	    'I' : { nextState : 's2', write: 'I', move: 'L' },
	    '' : { nextState : 's3', write: '', move: 'R' }
	}
    };
    var startState = 's1';

    it('should constructed with a word, a rulebook and a start state', function(){
	var machine = new tm.Machine(word, rulebook, startState);

	expect(machine.currentState()).toBe(startState);
	expect(machine.read()).toBe('I');
	expect(machine.error()).toBe(false);
    });

    it('should step through a single execution', function(){
	var machine = new tm.Machine(word, rulebook, startState);

	expect(machine.currentState()).toBe(startState);
	expect(machine.read()).toBe('I');

	machine.step();

	expect(machine.currentState()).toBe('s1');
	expect(machine.read()).toBe('');

	machine.step();

	expect(machine.currentState()).toBe('s2');
	expect(machine.read()).toBe('I');

	machine.step();

	expect(machine.currentState()).toBe('s2');
	expect(machine.read()).toBe('');

	machine.step();

	expect(machine.currentState()).toBe('s3');
	expect(machine.read()).toBe('I');
    });

    it('should make multiple step', function(){
	var machine = new tm.Machine(word, rulebook, startState);

	expect(machine.currentState()).toBe(startState);
	expect(machine.read()).toBe('I');

	machine.step(4);

	expect(machine.currentState()).toBe('s3');
	expect(machine.read()).toBe('I');
    });

    it('should halt in unknown state', function(){
	var machine = new tm.Machine(word, rulebook, 'unknown state');

	machine.step();

	expect(machine.error()).toBe(true);
    });
});
