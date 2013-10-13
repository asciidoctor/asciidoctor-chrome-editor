var editor = ace.edit("ace_embedded_code");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/asciidoc");

var AUTO_RELOAD_INTERVAL_TIME = 2000;

editor.session.on('change', function () {
    // Delay rendering by 2 seconds.
    var autoReloadInterval = setInterval(function () {
        var data = editor.getValue();
        render(data);
        clearInterval(autoReloadInterval);
    }, AUTO_RELOAD_INTERVAL_TIME);
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