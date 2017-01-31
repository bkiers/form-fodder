function modResult(reformattedIban) {

    var total = 0;

    for (var i = 0, j = reformattedIban.length; i < j; i++) {

        var digit = parseInt(reformattedIban[i], 36);
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

    var placeholderPatternsStr =
        "voornaam                    Piet\n" +
        "tussenvoegsel               van\n" +
        "achternaam                  Verdriet\n" +
        "geboortedatum|dd.mm.jjjj    01/01/1970\n" +
        "postcode|zip                1042AA\n" +
        "huisnr|huisnummer           42\n" +
        "toevoeging                  a\n" +
        "iban|rekening(nummer)?      randomIban(['RABO', 'ASNB', 'INGB', 'SNSB'])\n" +
        "e-?mail                     bart+qwerty1@q42.nl\n" +
        "wachtwoord                  Test123456";;

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
