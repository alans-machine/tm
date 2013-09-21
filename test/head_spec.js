/*global describe:false, it:false, expect:false, tm:false */
describe('head', function(){
    it('should be constructed with a word', function(){
        var head = tm.tape('a');

        expect(head.read()).toBe('a');
    });

    it('should be able to move right', function(){
        var head = tm.tape('ab');

        head.right();

        expect(head.read()).toBe('b');
    });

    it('should be able to move left', function(){
        var head = tm.tape('ba');

        head.right().left();

        expect(head.read()).toBe('b');
    });

    it('should read blank after word', function(){
        var head = tm.tape('a');

        head.right();

        expect(head.read()).toBe('');
    });

    it('should read blank before word', function(){
        var head = tm.tape('a');

        head.left();

        expect(head.read()).toBe('');
    });

    it('should write symbol', function(){
        var head = tm.tape('b');

        head.write('a');

        expect(head.read()).toBe('a');
    });

    it('should be able to configure blank symbol', function(){
        var options = { blank : '_' };
        var head = tm.tape('a', options);

        head.right();

        expect(head.read()).toBe(options.blank);
   });

    it('should execute an instruction', function(){
        var head = tm.tape('cb');
        var instruction = { nextState : 's1', write: 'a', move: 'R' };

        head.execute(instruction);

        expect(head.read()).toBe('b');
        expect(head.left().read()).toBe('a');
    });
});
