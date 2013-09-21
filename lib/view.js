(function(tm, undefined){
    function containerFrom(id){
        return document.getElementById(id);
    };

    function StepView(parentContainer, machine){
        this.parentContainer = parentContainer;
        this.machine = machine;

        this.update();
    }
    StepView.prototype.update = function(){
        var button = document.createElement('button');
        button.innerText = 'step';
        button.addEventListener('click', this.step.bind(this));
        this.parentContainer.appendChild(button);
    };
    StepView.prototype.step = function(){
        this.machine.step();
    }

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
        pauze.innerText = '||';
        pauze.addEventListener('click', this.pauze.bind(this));
        return pauze;

    };
    AutoPlayView.prototype.playButton = function(){
        var play = document.createElement('button');
        play.innerText = '>';
        play.addEventListener('click', this.play.bind(this));
        return play;
    };
    AutoPlayView.prototype.pauze = function(){
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = undefined;
    }
    AutoPlayView.prototype.play = function(){
        if (!this.interval) {
            this.step();
            this.interval = setInterval(this.step.bind(this), this.options.delay);
        }
    }
    AutoPlayView.prototype.step = function(){
        this.machine.step();
    }


    function ControlView(parentContainer, machine, options){
        this.parentContainer = parentContainer;
        this.machine = machine;
        this.options = options;

        this.update();
    };
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
    }

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
    };
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
    };
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
    };

    tm.MachineView = MachineView;
})(tm);
