(function(tm){
    var word = 'II';
    var rulebook = {
	's1' : {
	    'I' : { nextState : 's1', write: 'I', move: 'R' },
	    '' : { nextState : 's2', write: 'I', move: 'L' }
	},
	's2' : {
	    'I' : { nextState : 's2', write: 'I', move: 'L' },
	    '' : { nextState : 's1', write: '', move: 'R' }
	}
    };
    var startState = 's1';

    document.querySelector('.turing-machine').setAttribute('id', 'turing-machine');

    var machine = new tm.Machine(word, rulebook, startState);
    new tm.MachineView('turing-machine', machine);

})(tm);
