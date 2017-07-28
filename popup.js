var port = chrome.extension.connect({name: "Hash Messages"});
port.postMessage("Requesting hash message.");
port.onMessage.addListener(function(msg) {
    document.getElementById("hash_message").innerHTML=msg;
});
