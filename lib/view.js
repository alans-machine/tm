(function(tm){
    function containerFrom(id){
	return document.getElementById(id);
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
    };
    CellView.prototype.container = function(){
	if(!this._container){
	    this._container = document.createElement('span');
	    this._container.setAttribute('class', 'cell');
	    this.parentContainer.appendChild(this._container);
	}
	return this._container;
    };
    CellView.prototype.update = function(){
	var container = this.container();
	var tape = this.machine._head.tape.index(this.index);
	container.textContent = tape.read();
    };

    function TapeView(parentContainer, machine){
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
	for(var index = -2; index < 3; index++) {
	    new CellView(container, this.machine, index);
	}
    };

    function MachineView(id, machine){
	this.container = containerFrom(id);
	this.stateView = new StateView(this.container, machine);
	this.tapeView = new TapeView(this.container, machine);
    };

    tm.MachineView = MachineView;
})(tm);
