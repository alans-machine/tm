/*! tm - v0.0.0 - 2014-12-09
* Copyright (c) 2014 Daan van Berkel; Licensed  */
window.util = (function(){
    function merge(target){
        var continuation = {};
        function and(options){
            for (var key in options) {
                target[key] = options[key];
            }
            return continuation;
        }
        continuation.and = and;
        return continuation;
    }

    return {
        merge: merge
    };
})();

window.tm = (function(){
    return {};
})();

(function(tm, undefined){
    function Tape(symbol, options){
        this.symbol = symbol;
        this.options = options;
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
    Tape.prototype.index = function(n) {
        if (n === 0) {
            return this;
        } else if (n < 0) {
            return this.left().index(n+1);
        } else if (n > 0) {
            return this.right().index(n-1);
        }
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
    }
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

(function(tm, undefined){
    function StateMachine(rulebook, startState){
        this._rulebook = rulebook;
        this._currentState = startState;
    }
    StateMachine.prototype.currentState = function(){
        return this._currentState;
    };
    StateMachine.prototype.instructionFor = function(symbol){
        var possibleInstructions = this._rulebook[this._currentState];
        if (possibleInstructions){
            var instruction = possibleInstructions[symbol];
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

(function(tm, undefined){
    function Machine(word, rulebook, startState, options){
        this.options = { stopState :  'HALT' };
        util.merge(this.options).and(options);
        this._head = new tm.tape(word, this.options);
        this._stateMachine = new tm.StateMachine(rulebook, startState);
        this._error = false;
        this._halt = false;
        this._observers = [];
    }
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
            if (instruction && instruction.nextState === this.options.stopState) {
                this._halt = true;
            } else if(instruction) {
                this._head.execute(instruction);
                this._stateMachine.execute(instruction);
            } else {
                this._error = true;
                this._halt = true;
            }
            this.notify();
            n--;
        }
    };
    Machine.prototype.error = function(){
        return this._error;
    };
    Machine.prototype.halted = function(){
        return this._halt;
    };
    Machine.prototype.addObserver = function(callback){
        this._observers.push(callback);
    };
    Machine.prototype.notify = function(){
        this._observers.forEach(function(observer){
            observer.call(null, this);
        }.bind(this));
    };

    tm.Machine = Machine;
})(tm);

(function(tm, undefined){
    function containerFrom(id){
        return document.getElementById(id);
    }

    function StepView(parentContainer, machine){
        this.parentContainer = parentContainer;
        this.machine = machine;

        this.update();
    }
    StepView.prototype.update = function(){
        var button = document.createElement('button');
        button.innerHTML = 'step';
        button.addEventListener('click', this.step.bind(this));
        this.parentContainer.appendChild(button);
    };
    StepView.prototype.step = function(){
        this.machine.step();
    };

    function AutoPlayView(parentContainer, machine, options){
        this.options = { delay: 1000 };
        util.merge(this.options).and(options);
        this.parentContainer = parentContainer;
        this.machine = machine;
        this.interval = undefined;
        this.update();
    }
    AutoPlayView.prototype.update = function(){
        var pauze = this.pauzeButton();
        this.parentContainer.appendChild(pauze);
        var play = this.playButton();
        this.parentContainer.appendChild(play);
    };
    AutoPlayView.prototype.pauzeButton = function(){
        var pauze= document.createElement('button');
        pauze.innerHTML = '||';
        pauze.addEventListener('click', this.pauze.bind(this));
        return pauze;

    };
    AutoPlayView.prototype.playButton = function(){
        var play = document.createElement('button');
        play.innerHTML = '&gt;';
        play.addEventListener('click', this.play.bind(this));
        return play;
    };
    AutoPlayView.prototype.pauze = function(){
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = undefined;
    };
    AutoPlayView.prototype.play = function(){
        if (!this.interval) {
            this.step();
            this.interval = setInterval(this.step.bind(this), this.options.delay);
        }
    };
    AutoPlayView.prototype.step = function(){
        this.machine.step();
    };


    function ControlView(parentContainer, machine, options){
        this.parentContainer = parentContainer;
        this.machine = machine;
        this.options = options;

        this.update();
    }
    ControlView.prototype.container = function(){
        if(!this._container){
            this._container = document.createElement('div');
            this._container.setAttribute('class', 'control');
            this.parentContainer.appendChild(this._container);
        }
        return this._container;
    };
    ControlView.prototype.update = function(){
        var container = this.container();
        new StepView(container, this.machine, this.options);
        new AutoPlayView(container, this.machine, this.options);
    };
    ControlView.prototype.step = function(){
        this.machine.step();
    };

    function StateView(parentContainer, machine){
        this.parentContainer = parentContainer;
        this.machine = machine;

        machine.addObserver(this.update.bind(this));

        this.update();
    }
    StateView.prototype.container = function(){
        if(!this._container){
            this._container = document.createElement('div');
            this._container.setAttribute('class', 'state');
            this.parentContainer.appendChild(this._container);
        }
        return this._container;
    };
    StateView.prototype.update = function(){
        var container = this.container();
        container.innerHTML = '<span>' + this.machine.currentState() + '</span>';
    };

    function CellView(parentContainer, machine, index){
        this.parentContainer = parentContainer;
        this.machine = machine;
        this.index = index;

        this.machine.addObserver(this.update.bind(this));

        this.update();
    }
    CellView.prototype.container = function(){
        if(!this._container){
            this._container = document.createElement('span');
            this._container.setAttribute('class', this.classes());
            this.parentContainer.appendChild(this._container);
        }
        return this._container;
    };
    CellView.prototype.update = function(){
        var container = this.container();
        var tape = this.machine._head.tape.index(this.index);
        container.textContent = tape.read();
    };
    CellView.prototype.classes = function(){
        if (this.index === 0) {
            return 'cell head';
        }
        return 'cell';
    };

    function TapeView(parentContainer, machine, options){
        this.options = { borderCells: 2 };
        util.merge(this.options).and(options);
        this.parentContainer = parentContainer;
        this.machine = machine;
        this.createCells();
    }
    TapeView.prototype.container = function(){
        if(!this._container){
            this._container = document.createElement('div');
            this._container.setAttribute('class', 'tape');
            this.parentContainer.appendChild(this._container);
        }
        return this._container;
    };
    TapeView.prototype.createCells = function(){
        var container = this.container();
        var borderCells = this.options.borderCells;
        for(var index = -borderCells; index <= borderCells; index++) {
            new CellView(container, this.machine, index);
        }
    };

    function MachineView(id, machine, options){
        this.options = { };
        util.merge(this.options).and(options);
        this.container = containerFrom(id);
        this.controlView = new ControlView(this.container, machine, this.options);
        this.stateView = new StateView(this.container, machine, this.options);
        this.tapeView = new TapeView(this.container, machine, this.options);
    }

    tm.MachineView = MachineView;
})(tm);
