/**
 * Created by barkerc1 on 10/23/16.
 */


//used for testing
var helloWorld = function () {
    var str = "Hello world";
    alert(str);
};
$(document).ready(function () {
    var game = new SuperBattleship();
    var gui_player_one = new GUIPlayer(game, $('#p1_cli_input'),
        $('#p1_cli_output'), $('#p1_view'), true);
    var ai_player_two = new DumbAI(game, false);
    game.startGame();
});