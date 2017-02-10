function saveSettings() {

    var namePatterns = document.getElementById('namePatterns').value;

    chrome.storage.sync.set({
        namePatterns: namePatterns
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'options saved';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    });
}

function loadSettings() {
    chrome.storage.sync.get(['banks', 'namePatterns'], function(items) {
        document.getElementById('namePatterns').value = items.namePatterns;
    });
}

document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('save').addEventListener('click', saveSettings);