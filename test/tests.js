const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const mlog = require('mocha-logger');
const util = require('util');
const Scope = require('../Scope').Scope;

describe('Scope', () => {
	describe('static', () => {
		it('Scope is a function', () => {
			expect(Scope).to.be.an.instanceof(Function);
		});

		it('init is a function', () => {
			expect(Scope.init).to.be.an.instanceof(Function);
		});

		it('_2key is function', () => {
			expect(Scope._2key).to.be.an.instanceof(Function);
		});

		it('_2key(number)', () => {
			let k1 = 1;
			expect(Scope._2key(k1)).to.be.an('string').to.equal(JSON.stringify(k1));
		});

		it('_2key(array)', () => {
			let k2 = [1, 2];
			expect(Scope._2key(k2)).to.be.an('string').to.equal(JSON.stringify(k2));
		});

		it('_2key(object)', () => {
			let k3 = {a: 1, b: 2};
			expect(Scope._2key(k3)).to.be.an('string').to.equal(JSON.stringify(k3));
		});

		it('_4key is function', () => {
			expect(Scope._4key).to.be.an.instanceof(Function);
		});

		it('_4key(number)', () => {
			let k1 = 1;
			expect(Scope._4key(JSON.stringify(k1))).to.be.an('number').to.equal(k1);
		});

		it('_4key(array)', () => {
			let k2 = [1, 2];
			expect(Scope._4key(JSON.stringify(k2))).to.be.an('array').to.have.members(k2);
		});

		it('_4key(object)', () => {
			let k3 = {a: 1, b: 2};
			expect(Scope._4key(JSON.stringify(k3))).to.be.an('object').to.include(k3);
		});

	});
	
	describe('instance', () => {
		it('Scope creats instanceof Scope', () => {
			expect(new Scope()).to.be.an.instanceof(Scope);
		});

		it('Scope.init creats instanceof Scope', () => {
			expect(Scope.init()).to.be.an.instanceof(Scope);
		});

		it('Scope.init creats instanceof Scope with arguments', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			expect(Scope.init(k1, k2)).to.be.an.instanceof(Scope);
		});

		it('count calculate Scope size', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			expect(Scope.init(k1, k2, k3).count).to.be.an('number').to.equal(3);
		});

		it('keys return Scope keys in array', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			expect(Scope.init(k1, k2).keys).to.be.an('array').to.members(['key-1', 'key-2']);
		});

		it('_is check key in Scope', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let s = Scope.init(k1, k2);
			expect(s._is).to.be.an.instanceof(Function);
			expect(s._is('key-1')).to.be.an('boolean').to.true;
			expect(s._is('key-2')).to.be.an('boolean').to.true;
			expect(s._is('key-3')).to.be.an('boolean').to.false;
		});

		it('_get return value by key from Scope', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let s = Scope.init(k1, k2);
			expect(s._get).to.be.an.instanceof(Function);
			expect(s._get('key-1')).to.equal('value-1');
			expect(s._get('key-2')).to.equal('value-2');
			expect(() => s._get('key-3')).to.throw();
		});

		it('_set adds pair (key, value) to Scope', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let k4 = { 'x': 'value-4' };
			let k5 = { 'x': 'value-5' };
			let s = Scope.init(k1, k2);
			expect(s._set).to.be.an.instanceof(Function);
			expect(s._set(k3)).to.false;
			expect(s._get('key-3')).to.equal('value-3');
			expect(s._set(k4)).to.false;
			expect(s._get('x')).to.equal('value-4');
			expect(s._set(k5)).to.true;
			expect(s._get('x')).to.equal('value-5');
			expect(s.keys).to.have.members(['key-1', 'key-2', 'key-3', 'x']);
		});

		it('_unset removes pair (key, value) from Scope by key', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let k4 = 1;
			let s = Scope.init(k1, k2, k3);
			expect(s._unset).to.be.an.instanceof(Function);
			expect(s._unset(k4)).to.false;
			expect(s._unset('key-2')).to.true;
			expect(s.keys).to.have.members(['key-1', 'key-3']);
		});

		it('isItem alias to Scope._is', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let s = Scope.init(k1, k2);
			expect(s.isItem).to.be.an.instanceof(Function);
			expect(s.isItem('key-2')).to.be.an('boolean').to.true;
			expect(s.isItem('key-3')).to.be.an('boolean').to.false;
		});

		it('getItem alias to Scope._get', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let s = Scope.init(k1, k2, k3);
			expect(s.getItem).to.be.an.instanceof(Function);
			expect(s.getItem('key-2')).to.equal('value-2');
			expect(() => s.getItem('key-4')).to.throw();
		});

		it('setItem alias to Scope._set', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let s = Scope.init(k1, k2);
			expect(s.setItem).to.be.an.instanceof(Function);
			expect(s.setItem(k3)).to.false;
			expect(s.setItem(k3)).to.true;
			expect(s.keys).to.have.members(['key-1', 'key-2', 'key-3']);
		});

		it('unsetItem alias to Scope._unset', () => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let k4 = 1;
			let s = Scope.init(k1, k2, k3);
			expect(s.unsetItem).to.be.an.instanceof(Function);
			expect(s.unsetItem(k4)).to.false;
			expect(s.unsetItem('key-2')).to.true;
			expect(s.keys).to.have.members(['key-1', 'key-3']);
		});

	});

});

