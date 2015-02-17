/* global describe, it */

(function () {
    'use strict';
    describe('on page load', function(){
      describe('layout', function(){
        expect($('.player-container')).to.be.ok;
        expect($('.enemy-container')).to.be.ok;
        expect($('.container').html().match('Fight')).to.be.ok;
      })
    });



})();
