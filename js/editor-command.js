var editor = ace.edit("ace_embedded_code");

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};

function getPosition(selectionRange) {
    var pattern = new RegExp(/\[([0-9]+)\/([0-9]+)\]\ ->\ \[([0-9]+)\/([0-9]+)\]/g);
    var match = pattern.exec(selectionRange);
    var startRow = parseInt(match[1]);
    var startColumn = parseInt(match[2]);
    var endRow = parseInt(match[3]);
    var endColumn = parseInt(match[4]);
    return {startRow:startRow, startColumn:startColumn, endRow:endRow, endColumn:endColumn};
}

function headerStyle(markupCharacter) {
    // Select the whole line
    editor.selection.selectLine();
    var selectionRange = editor.getSelectionRange();
    var selectedText = editor.session.getTextRange(selectionRange);
    var position = getPosition(selectionRange);
    // Remove current heading markup
    selectedText = selectedText.replace(/^[=]* /, "");
    if (selectedText.trim().length == 0) {
        selectedText = "Heading";
        editor.selection.moveCursorTo(position.startRow, 0);
    } else {
        // Remove the whole line
        editor.session.remove(selectionRange);
    }
    // Insert the text content with the markup
    editor.insert(markupCharacter + " " + selectedText);
    // Select the text content line (without markup)
    editor.selection.moveCursorTo(position.startRow, markupCharacter.length + 1);
    editor.selection.selectLineEnd();
}

function isMarkupChar(character) {
    return character.trim() == "*" || character.trim() == "_";
}

function isInsideWord(selectionRange, startRow, startColumn, endRow, endColumn) {
    var insideWord = false;
    // Previous character
    selectionRange.setStart(startRow, startColumn - 1);
    selectionRange.setEnd(endRow, startColumn);
    var previousCharacter = editor.session.getTextRange(selectionRange);
    if (previousCharacter.trim().length != 0 && !isMarkupChar(previousCharacter)) {
        insideWord = true;
    }
    // Next character
    selectionRange.setStart(endRow, endColumn);
    selectionRange.setEnd(endRow, endColumn + 1);
    var nextCharacter = editor.session.getTextRange(selectionRange);
    if (nextCharacter.trim().length != 0 && !isMarkupChar(nextCharacter)) {
        insideWord = true;
    }
    return insideWord;
}

function fontStyle(markupCharacter, defaultContentText) {
    var selectionRange = editor.getSelectionRange();
    var userSelectedText = editor.session.getTextRange(selectionRange);

    var position = getPosition(selectionRange);
    var startRow = position.startRow;
    var startColumn = position.startColumn;
    var endRow = position.endRow;
    var endColumn = position.endColumn;

    var contentText;
    var insideWord;
    if (userSelectedText.trim().length == 0) {
        contentText = defaultContentText;
        endColumn = startColumn + contentText.length;
        selectionRange.setStart(startRow, startColumn);
        selectionRange.setEnd(endRow, endColumn + 1);
        insideWord = false;
    } else {
        // Select only non empty part of the selected text
        var firstNonEmpty = userSelectedText.search("[^ ]");
        var lastNonEmpty = userSelectedText.search("[^ ][ ]*$") + 1;
        startColumn += firstNonEmpty;
        endColumn = startColumn + (lastNonEmpty - firstNonEmpty);
        selectionRange.setStart(startRow, startColumn);
        selectionRange.setEnd(endRow, endColumn);
        editor.selection.setSelectionRange(selectionRange.toScreenRange(editor.session));
        // Get the non empty part of the text
        contentText = editor.session.getTextRange(selectionRange);
        // Is the selected text inside a word ?
        insideWord = isInsideWord(selectionRange, startRow, startColumn, endRow, endColumn);
    }
    var markup;
    if (insideWord) {
        markup = markupCharacter + markupCharacter;
    } else {
        markup = markupCharacter;
    }
    // Insert the text content with the markup
    editor.insert(markup + contentText + markup);
    // Select the text content
    selectionRange.setStart(startRow, startColumn + markup.length);
    selectionRange.setEnd(endRow, endColumn + markup.length);
    editor.selection.setSelectionRange(selectionRange.toScreenRange(editor.session));
}

function bold() {
    fontStyle("*", "strong text");
}

function italic() {
    fontStyle("_", "emphasized text");
}

function h1() {
    headerStyle("=");
}

function h2() {
    headerStyle("==");
}

function h3() {
    headerStyle("===");
}

function h4() {
    headerStyle("====");
}

editor.commands.addCommands([
    {
        name:"h1",
        bindKey:{
            win:"Ctrl-1",
            mac:"Command-1"
        },
        exec:function () {
            h1();
        },
        readOnly:false
    },
    {
        name:"h2",
        bindKey:{
            win:"Ctrl-2",
            mac:"Command-2"
        },
        exec:function () {
            h2();
        },
        readOnly:false
    },
    {
        name:"h3",
        bindKey:{
            win:"Ctrl-3",
            mac:"Command-3"
        },
        exec:function () {
            h3();
        },
        readOnly:false
    },
    {
        name:"h4",
        bindKey:{
            win:"Ctrl-4",
            mac:"Command-4"
        },
        exec:function () {
            h4();
        },
        readOnly:false
    },
    {
        name:"bold",
        bindKey:{
            win:"Ctrl-b",
            mac:"Command-b"
        },
        exec:function () {
            bold();
        },
        readOnly:false
    },
    {
        name:"italic",
        bindKey:{
            win:"Ctrl-i",
            mac:"Command-i"
        },
        exec:function () {
            italic();
        },
        readOnly:false
    }
]);