var editor = ace.edit("ace_embedded_code");
$("#bold").click(function () {
    bold();
    editor.focus();
});
$("#italic").click(function () {
    italic();
    editor.focus();
});
$("#h1").click(function () {
    h1();
    editor.focus();
});
$("#h2").click(function () {
    h2();
    editor.focus();
});
$("#h3").click(function () {
    h3();
    editor.focus();
});
$("#h4").click(function () {
    h4();
    editor.focus();
});