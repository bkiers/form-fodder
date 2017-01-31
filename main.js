function modResult(reformattedIban) {

    var numberMapping = {
        '0':  0, '1':  1, '2':  2, '3':  3, '4':  4, '5':  5, '6':  6, '7':  7, '8':  8, '9':  9,
        'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18, 'J': 19,
        'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27, 'S': 28, 'T': 29,
        'U': 30, 'V': 31, 'W': 32, 'X': 33, 'Y': 34, 'Z': 35
    };

    var total = 0;

    for (var i = 0, j = reformattedIban.length; i < j; i++) {

        var digit = numberMapping[reformattedIban[i]];
        var multiplier = digit > 9 ? 100 : 10;

        total = (total * multiplier) + digit;

        if (total > 99999999) {
            // Make sure there's no overflow
            total = total % 97;
        }
    }

    return total % 97;
}

function randomIban(banks) {
    var bban = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
    var bank = banks[Math.floor(Math.random() * banks.length)];
    var checkNumber = 98 - modResult(bank + '' + bban + "NL00");
    return "NL" + (checkNumber < 10 ? '0' + checkNumber : checkNumber) + bank + bban;
}

function searchAndReplace(placeholderPatternsStr) {

    var placeholderPatternsLines = placeholderPatternsStr.trim().split(/[\r\n]+/);
    var placeholderPatterns = {};

    for (var i = 0, j = placeholderPatternsLines.length; i < j; i++) {
        var matches = placeholderPatternsLines[i].trim().match(/^(\S+)\s+(.+)/)
        placeholderPatterns[matches[1]] = matches[2];
    }

    var inputs = document.getElementsByTagName('input');

    for (var index = 0; index < inputs.length; index++) {

        if (inputs[index] && inputs[index].placeholder) {

            var foundMatchingPattern = false;

            for (var pattern in placeholderPatterns) {

                var input = inputs[index];

                if (input.placeholder.match(new RegExp(pattern, 'i'))) {

                    var value = placeholderPatterns[pattern];

                    if (value.endsWith(")")) {
                        value = eval(value);
                    }

                    input.focus();
                    input.removeAttribute('aria-describedby');
                    input.setAttribute('aria-invalid', 'false');
                    input.innerHTML = value;
                    input.setAttribute('value', value);

                    foundMatchingPattern = true;
                    break;
                }
            }

            if (!foundMatchingPattern) {
                console.log('No pattern found for placeholder: ' + inputs[index].placeholder);
            }
        }
    }
}

(function() {

    var placeholderPatternsStr = "voornaam                    Piet\n" +
                                 "tussenvoegsel               van\n" +
                                 "achternaam                  Verdriet\n" +
                                 "geboortedatum               01/01/1970\n" +
                                 "postcode                    3000AA\n" +
                                 "huisnr                      42\n" +
                                 "toevoeging                  a\n" +
                                 "iban|rekening(nummer)?      randomIban(['RABO', 'ASNB', 'INGB', 'SNSB'])\n" +
                                 "e-?mail                     bart+qwerty1@q42.nl\n" +
                                 "wachtwoord                  Test123456";

    chrome.storage.sync.get(['alreadyStarted', 'banks', 'placeholderPatterns'], function(items) {

        if (!items['alreadyStarted']) {
            chrome.storage.sync.set({
                alreadyStarted: 'true',
                placeholderPatterns: placeholderPatternsStr
            }, function() {
                searchAndReplace(placeholderPatternsStr);
            });
        } else {
            searchAndReplace(items['placeholderPatterns']);
        }
    });
})();
