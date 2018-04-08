#!/usr/bin/env node

'use strict';

class Scope {

	static init (...args) {
		return Object.freeze(new Scope(...args));
	}

	static _2key (key) {
		return JSON.stringify(key);
	}

	static _4key (key) {
		return JSON.parse(key);
	}

	constructor (...args) {
		this._scope = {};
		this._set(...args);
	}

	get count () {
		return Object.keys(this._scope).length;
	}

	get keys () {
		return Object.keys(this._scope).map(key => Scope._4key(key));
	}

	_is (key) {
		return Scope._2key(key) in this._scope;
	}

	_get (key) {
		if (this._is(key)) return this._scope[Scope._2key(key)];
		throw new Error('Scope._get called with key not in Scope');
	}

	_set (...args) {
		return this._setArray(args);
	}

	_setArray (array) {
		if (arguments.length===0) return [];
		if (array instanceof Array) {
			let result = array.map(item => this._setObject(item), this);
			result = [].concat(...result);
			return result.length===1 ? result[0] : result;
		}
		throw new Error('Scope._setArray called with non-array');
	}

	_setObject (object) {
		if (object instanceof Object) {
			let result = Object.keys(object).map(key => this._setKeyValue(key, object[key]), this);
			return result.length===1 ? result[0] : result;
		}
		throw new Error('Scope._setObject called with non-object');
	}

	_setKeyValue (key, value) {
		const result = this._is(key);
		this._scope[Scope._2key(key)] = value;
		return result;
	}

	_unset (key) {
		const result = this._is(key);
		delete this._scope[Scope._2key(key)];
		return result;
	}

	isItem (...args) {
		return this._is(...args);
	}

	getItem (...args) {
		return this._get(...args);
	}

	setItem (...args) {
		return this._set(...args);
	}

	unsetItem (...args) {
		return this._unset(...args);
	}

}

exports.Scope = Scope;
