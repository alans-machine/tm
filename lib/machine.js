/*global tm:true, util:false*/
(function(tm, undefined){
    function Machine(word, rulebook, startState, options){
        this.options = { stopState :  'HALT' };
        util.merge(this.options).and(options);
        this._head = new tm.tape(word, this.options);
        this._stateMachine = new tm.StateMachine(rulebook, startState);
        this._error = false;
        this._halt = false;
        this._observers = [];
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
    }
    Machine.prototype.error = function(){
        return this._error;
    }
    Machine.prototype.halted = function(){
        return this._halt;
    }
    Machine.prototype.addObserver = function(callback){
        this._observers.push(callback);
    }
    Machine.prototype.notify = function(){
        this._observers.forEach((function(observer){
            observer.call(null, this);
        }).bind(this));
    }

    tm.Machine = Machine;
})(tm);
