#!/usr/bin/env node

'use strict';


const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const mlog = require('mocha-logger');
const util = require('util');

const Scope = require('../Scope').Scope;


describe('Scope', () => {

	describe('static', () => {
		
		it('Scope is a function', (done) => {
			expect(Scope).to.be.an.instanceof(Function);
			done();
		});

		it('Scope._2key is function', (done) => {
			expect(Scope._2key).to.be.an.instanceof(Function);
			done();
		});

		it('Scope._2key(number)', (done) => {
			let k1 = 1;

			expect(Scope._2key(k1)).to.be.an('string').to.equal(JSON.stringify(k1));
			done();
		});

		it('Scope._2key(array)', (done) => {
			let k2 = [1, 2];

			expect(Scope._2key(k2)).to.be.an('string').to.equal(JSON.stringify(k2));
			done();
		});

		it('Scope._2key(object)', (done) => {
			let k3 = {a: 1, b: 2};

			expect(Scope._2key(k3)).to.be.an('string').to.equal(JSON.stringify(k3));
			done();
		});

		it('Scope._4key is function', (done) => {
			expect(Scope._4key).to.be.an.instanceof(Function);
			done();
		});

		it('Scope._4key(number)', (done) => {
			let k1 = 1;

			expect(Scope._4key(JSON.stringify(k1))).to.be.an('number').to.equal(k1);
			done();
		});

		it('Scope._4key(array)', (done) => {
			let k2 = [1, 2];

			expect(Scope._4key(JSON.stringify(k2))).to.be.an('array').to.have.members(k2);
			done();
		});

		it('Scope._4key(object)', (done) => {
			let k3 = {a: 1, b: 2};

			expect(Scope._4key(JSON.stringify(k3))).to.be.an('object').to.include(k3);
			done();
		});

		it('Scope.init is a function', (done) => {
			expect(Scope.init).to.be.an.instanceof(Function);
			done();
		});

		it('Scope.init creates instanceof Scope', (done) => {
			expect(Scope.init()).to.be.an.instanceof(Scope);
			done();
		});

		it('Scope.init creates instanceof Scope with arguments', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };

			expect(Scope.init(k1, k2)).to.be.an.instanceof(Scope);
			done();
		});

	});
	
	describe('instance', () => {
		it('Scope creates instanceof Scope', (done) => {
			expect(new Scope()).to.be.an.instanceof(Scope);
			done();
		});

		it('Scope.count calculate Scope size', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };

			expect(Scope.init(k1, k2, k3).count).to.be.an('number').to.equal(3);
			done();
		});

		it('Scope.keys return Scope keys in array', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };

			expect(Scope.init(k1, k2).keys).to.be.an('array').to.members(['key-1', 'key-2']);
			done();
		});

		it('Scope._is check key in Scope', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let s = Scope.init(k1, k2);

			expect(s._is).to.be.an.instanceof(Function);
			expect(s._is('key-1')).to.be.an('boolean').to.true;
			expect(s._is('key-2')).to.be.an('boolean').to.true;
			expect(s._is('key-3')).to.be.an('boolean').to.false;
			done();
		});

		it('Scope._get return value by key from Scope', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let s = Scope.init(k1, k2);

			expect(s._get).to.be.an.instanceof(Function);
			expect(s._get('key-1')).to.equal('value-1');
			expect(s._get('key-2')).to.equal('value-2');
			expect(() => s._get('key-3')).to.throw();
			done();
		});

		it('Scope._set adds pair (key, value) to Scope', (done) => {
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
			done();
		});

		it('Scope._unset removes pair (key, value) from Scope by key', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let k4 = 1;
			let s = Scope.init(k1, k2, k3);

			expect(s._unset).to.be.an.instanceof(Function);
			expect(s._unset(k4)).to.false;
			expect(s._unset('key-2')).to.true;
			expect(s.keys).to.have.members(['key-1', 'key-3']);
			done();
		});

		it('Scope.isItem alias to Scope._is', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let s = Scope.init(k1, k2);

			expect(s.isItem).to.be.an.instanceof(Function);
			expect(s.isItem('key-2')).to.be.an('boolean').to.true;
			expect(s.isItem('key-3')).to.be.an('boolean').to.false;
			done();
		});

		it('Scope.getItem alias to Scope._get', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let s = Scope.init(k1, k2, k3);

			expect(s.getItem).to.be.an.instanceof(Function);
			expect(s.getItem('key-2')).to.equal('value-2');
			expect(() => s.getItem('key-4')).to.throw();
			done();
		});

		it('Scope.setItem alias to Scope._set', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let s = Scope.init(k1, k2);

			expect(s.setItem).to.be.an.instanceof(Function);
			expect(s.setItem(k3)).to.false;
			expect(s.setItem(k3)).to.true;
			expect(s.keys).to.have.members(['key-1', 'key-2', 'key-3']);
			done();
		});

		it('Scope.unsetItem alias to Scope._unset', (done) => {
			let k1 = { 'key-1': 'value-1' };
			let k2 = { 'key-2': 'value-2' };
			let k3 = { 'key-3': 'value-3' };
			let k4 = 1;
			let s = Scope.init(k1, k2, k3);
			
			expect(s.unsetItem).to.be.an.instanceof(Function);
			expect(s.unsetItem(k4)).to.false;
			expect(s.unsetItem('key-2')).to.true;
			expect(s.keys).to.have.members(['key-1', 'key-3']);
			done();
		});

	});

});
