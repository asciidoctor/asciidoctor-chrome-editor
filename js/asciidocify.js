var editor = ace.edit("ace_embedded_code");

var ASCIIDOCTOR_OPTIONS = Opal.hash2([ 'attributes' ], {
    'attributes':[ 'notitle!' ]
});

/**
 * AsciiDocify the content!
 */
function asciidocify() {
    render(editor.getValue());
}

/**
 * Render AsciiDoc content as HTML
 */
function render(data) {
    var generatedHtml = undefined;
    try {
        generatedHtml = Opal.Asciidoctor.$render(data, ASCIIDOCTOR_OPTIONS);
    }
    catch (e) {
        showErrorMessage(e.name + " : " + e.message);
        return;
    }
    $('#render').html(generatedHtml);
    syntaxHighlighting();
}

/**
 * Syntax highlighting
 */
function syntaxHighlighting() {
    $('pre > code').each(function (i, e) {
        hljs.highlightBlock(e);
    });
}

/**
 * Show error message
 * @param message The error message
 */
function showErrorMessage(message) {
    var messageText = "<p>" + message + "</p>";
    $('#render').html("<h4>Error</h4>" + messageText);
}

// Listen to Asciidoctor.js Live Preview Extension
chrome.runtime.onMessageExternal.addListener(function (url, sender) {
    if (sender.id == "dhjgmmkaeljbgmbjapejcpopihaneeoj") {
        $.ajax({
            url:url,
            cache:false,
            complete:function (data) {
                editor.setValue(data.responseText);
            }
        });
    }
});

asciidocify();