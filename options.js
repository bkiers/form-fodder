
function saveSettings() {

    var placeholderPatterns = document.getElementById('placeholderPatterns').value;

    chrome.storage.sync.set({
        placeholderPatterns: placeholderPatterns
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'options saved';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    });
}

function loadSettings() {
    chrome.storage.sync.get(['banks', 'placeholderPatterns'], function(items) {
        document.getElementById('placeholderPatterns').value = items.placeholderPatterns;
    });
}

document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('save').addEventListener('click', saveSettings);