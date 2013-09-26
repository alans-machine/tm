/*global describe:false, it:false, expect:false, beforeEach:false, afterEach:false, tm:false */
describe('view', function(){
    var word = '';
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
    var fixture;

    beforeEach(function(){
        var body = document.getElementsByTagName('body')[0];
        fixture = document.createElement('div');
        fixture.setAttribute('class', 'fixture');
        fixture.setAttribute('id', 'fixture');
        body.appendChild(fixture);
    });

    it('should create a state container', function(){
        var machine = new tm.Machine(word, rulebook, startState);
        new tm.MachineView('fixture', machine);

        expect(fixture.querySelectorAll('.state').length).toBe(1);
    });

    it('should create a tape container', function(){
        var machine = new tm.Machine(word, rulebook, startState);
        new tm.MachineView('fixture', machine);

        expect(fixture.querySelectorAll('.tape').length).toBe(1);
    });

    it('should create a control container', function(){
        var machine = new tm.Machine(word, rulebook, startState);
        new tm.MachineView('fixture', machine);

        expect(fixture.querySelectorAll('.control').length).toBe(1);
    });

    describe('state', function(){
        var machine;
        var stateContainer;

        beforeEach(function(){
            machine = new tm.Machine(word, rulebook, startState);
            new tm.MachineView('fixture', machine);
        });

        beforeEach(function(){
            stateContainer = fixture.querySelectorAll('.state')[0];
        });

        it('should contain a span', function(){
            expect(stateContainer.querySelectorAll('span').length).toBe(1);
        });

        it('span should contain current state', function(){
            var span = stateContainer.querySelector('span');
            expect(span.textContent).toBe(machine.currentState());
        });

        it('span should contain current state even after a step', function(){
            machine.step();

            var span = stateContainer.querySelector('span');
            expect(span.textContent).toBe(machine.currentState());
        });
    });

    describe('tape', function(){
        var machine;
        var tapeContainer;

        beforeEach(function(){
            machine = new tm.Machine('II', rulebook, startState);
            new tm.MachineView('fixture', machine);
        });

        beforeEach(function(){
            tapeContainer = fixture.querySelectorAll('.tape')[0];
        });

        it('should contain a spans', function(){
            expect(tapeContainer.querySelectorAll('span').length).toBe(5);
        });

        it('should be possible to configure the number of spans', function(){
            var options = { borderCells: 3 };
            machine = new tm.Machine('II', rulebook, startState);
            new tm.MachineView('fixture', machine, options);
            tapeContainer  = fixture.querySelectorAll('.tape')[1];

            expect(tapeContainer.querySelectorAll('span').length).toBe(2*options.borderCells + 1);
        });

        it('span should contain the tape surrounding head', function(){
            var spans = tapeContainer.querySelectorAll('span');


            expect(spans[0].innerHTML).toBe('');
            expect(spans[1].innerHTML).toBe('');
            expect(spans[2].innerHTML).toBe('I');
            expect(spans[3].innerHTML).toBe('I');
            expect(spans[4].innerHTML).toBe('');
        });

        it('span should contain the tape surrounding head even after a step', function(){
            machine.step();

            var spans = tapeContainer.querySelectorAll('span');

            expect(spans[0].innerHTML).toBe('');
            expect(spans[1].innerHTML).toBe('I');
            expect(spans[2].innerHTML).toBe('I');
            expect(spans[3].innerHTML).toBe('');
            expect(spans[4].innerHTML).toBe('');
        });
    });

    describe('control', function(){
        var machine;
        var controlContainer;

        beforeEach(function(){
            machine = new tm.Machine('', rulebook, startState);
            new tm.MachineView('fixture', machine);
        });

        beforeEach(function(){
            controlContainer = fixture.querySelectorAll('.control')[0];
        });

        it('should contain control buttons', function(){
            expect(controlContainer.querySelectorAll('button').length).toBe(3);
        });

        it('should step the machine on button \'step\' click', function(){
            var button = controlContainer.querySelector('button');

            button.click();

            expect(machine.currentState()).toBe('s2');
        });

        it('\'step\' button should have \'step\' as text', function(){
            var button = controlContainer.querySelector('button');

            expect(button.innerHTML).toBe('step');
        });
    });

    afterEach(function(){
        fixture.parentNode.removeChild(fixture);
    });
});
