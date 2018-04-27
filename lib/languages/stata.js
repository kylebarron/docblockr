var DocsParser = require("../docsparser");
var xregexp = require('../xregexp').XRegExp;

function StataParser(settings) {
    DocsParser.call(this, settings);
}

StataParser.prototype = Object.create(DocsParser.prototype);

StataParser.prototype.setup_settings = function() {
    var nameToken = '[A-Za-z_][A-Za-z0-9_]{0,31}';
    this.settings = {
        'typeInfo': false,
        'curlyTypes': false,
        'typeTag': 'param',
        'commentCloser': ' */',
        'fnIdentifier': nameToken,
        'varIdentifier': '(%s)(?::%s)?' % (nameToken, nameToken),
        // 'fnOpener': 'program' + nameToken,
        // 'fnOpener': 'pr(o|og|ogr|ogra|ogram)?\\s+(de(f|fi|fin|fine)?\\s+)?' + nameToken, //+ '.+\\n\\s+syntax',
        // 'fnOpener': 'function(?:\\s+[gs]et)?(?:\\s+' + nameToken + ')?\\s*\\(',
        'bool': 'bool',
        'function': 'function'
    };
};

StataParser.prototype.parse_function = function(line) {
    var regex = xregexp(
        // program (define)? fnName fnName = function,  fnName : function
        '(?:program\\s+(?P<name1>' + this.settings.fnIdentifier + '))?' +
        // function fnName
        // '(?:\\s+(?P<name2>' + this.settings.fnIdentifier + '))?' +
        // (arg1, arg2)
        '\\s*\\(\\s*(?P<args>.*?)\\)'
    );
    var matches = xregexp.exec(line, xregexp);
    if(matches === null)
        return null;

    regex = new RegExp(this.settings.varIdentifier, 'g');
    var name = matches.name1 && (matches.name1 || matches.name2 || '').replace(regex, '\\1');
    var args = matches.args;
    var options = {};

    return[name, args, null, options];
};

StataParser.prototype.parse_var = function(line) {
    return null;
};

StataParser.prototype.get_arg_name = function(arg) {
    var regex = new RegExp(this.settings.varIdentifier + '(\\s*=.*)?', 'g');
    return arg.replace(regex, '\\1');
};

StataParser.prototype.get_arg_type = function(arg) {
    // could actually figure it out easily, but it's not important for the documentation
    return null;
};

module.exports = StataParser;
