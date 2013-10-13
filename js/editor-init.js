var editor = ace.edit("ace_embedded_code");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/asciidoc");

editor.session.on('change', function () {
    var data = editor.getValue();
    render(data);
});

var current = chrome.app.window.current();

var updateMaxLinesNumber = function () {
    var newHeight = current.getBounds().height - 100;
    var maxLines = newHeight / editor.renderer.lineHeight;
    editor.setOptions({
        maxLines:maxLines
    });
    $("#render").height(newHeight + "px");
};

// Set initial lines number to match initial content
updateMaxLinesNumber();

current.onBoundsChanged.addListener(updateMaxLinesNumber);
current.onMaximized.addListener(updateMaxLinesNumber);
current.onMinimized.addListener(updateMaxLinesNumber);