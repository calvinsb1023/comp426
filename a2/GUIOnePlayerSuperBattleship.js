/**
 * Created by barkerc1 on 10/23/16.
 */


//used for testing
var helloWorld = function () {
    var str = "Hello world";
    alert(str);
};

$(document).ready(function () {
    var game = new SuperBattleship({boardSize: 32, turnLimit: 1000});
    var gui_player_one = new GUIPlayer(game, $('#output-view'), $('#p1-view'), true);
    var ai_player_two = new DumbAI(game, false, 300);
    game.startGame();
});