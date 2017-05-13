import React from 'react';
import ReactDOM from 'react-dom';
//import ReactTestUtils from 'react-addons-test-utils';
import Album from '../../components/Album.jsx';
var expect  = require('chai').expect;

describe('Testing the Album Component', function(){
    it('should exist', function(){
        expect(Album).to.exist;
    });
    
});
 