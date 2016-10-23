/**
 * Created by barkerc1 on 10/23/16.
 */

$(document).ready(function () {
    var game = new SuperBattleship();
    var gui_player_one = new GUIPlayer(game, $('#p1_cli_input'),
        $('#p1_cli_output'), $('#p1_view'), true);
    var ai_player_two = new DumbAI(game, false);
    game.startGame();
});

/*$(document).ready(function () {
    var game = new SuperBattleship();
    var gui_player_one = new GUIPlayer(game, $('#p1_cli_input'),
        $('#p1_cli_output'), $('#p1_view'), true);
    var ai_player_two = new DumbAI(game, false);
    game.startGame();
});*/