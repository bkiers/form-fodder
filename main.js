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

function searchAndReplace(namePatternsStr) {

    var namePatternsLines = namePatternsStr.trim().split(/[\r\n]+/);
    var namePatterns = {};

    for (var i = 0, j = namePatternsLines.length; i < j; i++) {
        var matches = namePatternsLines[i].trim().match(/^(\S+)\s+(.+)/)
        namePatterns[matches[1]] = matches[2];
    }

    var inputs = document.getElementsByTagName('input');

    for (var index = 0; index < inputs.length; index++) {

        if (inputs[index] && inputs[index].name) {

            var foundMatchingPattern = false;

            for (var pattern in namePatterns) {

                var input = inputs[index];

                if (input.name.match(new RegExp(pattern, 'i'))) {

                    var value = namePatterns[pattern];

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
                console.log('No `name` attribute found for input: ' + inputs[index].name);
            }
        }
    }
}

(function() {

    var version = 2;

    var namePatternsStr =
        "firstname                    Piet\n" +
        "prefix                       van\n" +
        "lastname                     Verdriet\n" +
        "birthdate                    01/01/1970\n" +
        "zipcode                      1042AA\n" +
        "housenumber                  42\n" +
        "country                      Nederland\n" +
        "street                       Radarweg\n" +
        "city                         Amsterdam\n" +
        "password                     Test123456\n" +
        "bankaccount                  randomIban(['RABO', 'ASNB', 'INGB', 'SNSB'])\n" +
        "e-?mail                      bart+qwerty1@q42.nl\n";

    chrome.storage.sync.get(['alreadyStarted', 'banks', 'namePatterns', 'version'], function(items) {

        console.log("previous version:", items['version'], ", current version:", version);

        if (!items['alreadyStarted'] || items['version'] != version) {
            chrome.storage.sync.set({
                version: version,
                alreadyStarted: 'true',
                namePatterns: namePatternsStr
            }, function() {
                searchAndReplace(namePatternsStr);
            });
        } else {
            searchAndReplace(items['namePatterns']);
        }
    });
})();
