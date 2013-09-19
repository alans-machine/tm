describe('merge', function(){
    it('should should merge objects', function(){
	var target = { a: 'a' };

	util.merge(target).and({ b : 'b' });

	expect(target.b).toBe('b');
    });

    it('should chain \'and\' methods', function(){
	var target = { a: 'a' };

	util.merge(target).and({ b : 'b' }).and({ c : 'c' });

	expect(target.c).toBe('c');
    });

    it('should give precedent to later objects', function(){
	var target = { a: 'a', b: 'a', c : 'a' };

	util.merge(target).and({ b : 'b', c : 'b' }).and({ c : 'c' });

	expect(target.a).toBe('a');
	expect(target.b).toBe('b');
	expect(target.c).toBe('c');
    });

    it('should not croak on undefined options', function(){
	var target = { a: 'a' };

	util.merge(target).and();

	expect(target.a).toBe('a');
    });
});
