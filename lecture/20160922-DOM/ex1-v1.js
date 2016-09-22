/**
 * Created by barkerc1 on 9/22/16.
 */

var func_obj = function() {
    alert("Hello, world!");

    var div_e1 = document.createElement('div');
    var h1_e1 = document.createElement('h1');
    var h1_text = document.createTextNode('if you can read this something\'s working');

    h1_e1.appendChild(h1_text);
    div_e1.appendChild(h1_e1);

    var body_e1 = document.getElementsByTagName('body')[0];
    body_e1.appendChild(div_e1);
};

var load_handler = {
    handleEvent: func_obj
};

window.addEventListener("load", load_handler);