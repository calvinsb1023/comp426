/**
 * Created by barkerc1 on 10/24/16.
 */

/*var should = require(should);
describe("Testing 'Hello world'", function() {
    it("It should simply return 'Hello world'", function () {
        debugger
        GUIPlayer.str.should.be.equal("Hello world");
    });
});*/

var should = require("should");
var echoTest = require('./echoTest');

describe("Checking if the user is created correctly", function(){
    it("should create the user with the correct name", function(){
        debugger;
        var str = "Hello world!";
        var guiPl = new echoTest(str);
        guiPl.name.should.be.equal(str);
    });
});