import React from 'react';
import ReactDOM from 'react-dom';
//import ReactTestUtils from 'react-addons-test-utils';
import MyApp from '../../components/MyApp.jsx';
var expect  = require('chai').expect;

describe('Testing the MyApp Component', function(){
    it('should exist', function(){
        expect(MyApp).to.exist;
    });
    
});