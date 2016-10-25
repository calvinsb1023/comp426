/**
 * Created by barkerc1 on 10/23/16.
 */
var echoTest = function(name) {
    this.name = name;
};

var mapDraw = function(width, height) {

};

var rows = 32;
var columns = 32;
var $row = $("<div />", {
    class: 'map-row'
});
var $square = $("<div />", {
    class: 'map-square'
});

$(document).ready(function () {
    //add columns to the the temp row object
    for (var i = 0; i < columns; i++) {
        $row.append($square.clone());
    }
    //clone the temp row object with the columns to the wrapper
    for (var i = 0; i < rows; i++) {
        $("#p1-view").append($row.clone());
    }
});



/**
 * Unit tests using Mocha and should.js
 */

var should = require("should"),
    jsdom = require('jsdom');
describe("Checking if the user is created correctly", function(){
    it("should create the user with the correct name", function(){
        debugger;
        var str = "Hello world!";
        var guiPl = new echoTest(str);
        guiPl.name.should.be.equal(str);
    });
});

describe("Checking to see if map of proper size is created", function() {
    it("should create a 32x32 grid of divs (of which 31x31 will be used for game play)", function() {
        debugger;
        var size = 32*32;
        mapDraw(32,32);
        var ms = $("div#p1-view").find(".map-square")
        var msCount = 0;
        for (item in ms) {
            msCount++;
        }
        msCount.should.be.equal(size);

    });
});