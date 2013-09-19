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

    it('should be able to configure blank symbol', function(){
	var options = { blank : '_' };
	var head = tm.tape('a', options);

	head.right();

	expect(head.read()).toBe(options.blank);
   });
});
