function DomHasher() {
}

DomHasher.hashes_file = "known_hashes.json";
DomHasher.hash_message = "No hash computed.";

DomHasher.notify_correct_hash = function(url, hash) {
    chrome.browserAction.setIcon({path:"check_icon.png"});
    DomHasher.hash_message = 'Hash for ' + url + ' verified:\n' + hash;
};

DomHasher.notify_incorrect_hash = function(url, correct_hash, incorrect_hash) {
    chrome.browserAction.setIcon({path:"redx_icon.png"});
    DomHasher.hash_message = 'Incorrect hash for ' + url + '. Expected: ' + correct_hash + " Received: " + incorrect_hash;
};

DomHasher.notify_unknown_hash = function(url, hash) {
    chrome.browserAction.setIcon({path:"question_icon.png"});
    DomHasher.hash_message = 'No stored hash for ' + url + '.';
}

DomHasher.verify_hash = function(url, result) {


    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL(DomHasher.hashes_file), true);

    xhr.responseType = 'json';
    xhr.onload = function () {
        var known_hashes = this.response;
        if(known_hashes.hasOwnProperty(url)) {
            var hash = CryptoJS.SHA256(result.toString()).toString(CryptoJS.enc.Hex);
            if(known_hashes[url] === hash) {
                DomHasher.notify_correct_hash(url, hash)
            } else {
                DomHasher.notify_incorrect_hash(url, known_hashes[url], hash)
            }
        } else {
            DomHasher.notify_unknown_hash(url)
        }
    };
    xhr.onerror = function() {
        DomHasher.hash_message = 'An error occured loading ' + DomHasher.hashes_file;
    };
    xhr.send();
};

chrome.webNavigation.onCompleted.addListener(function (details) {
    chrome.tabs.executeScript(details.tabId, {
        code: 'document.all[0].outerHTML'
    }, function (result) {
        if (chrome.runtime.lastError) {
            return;
        }
        DomHasher.verify_hash(details.url, result);
    });
});

chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        port.postMessage(DomHasher.hash_message);
    });
})
