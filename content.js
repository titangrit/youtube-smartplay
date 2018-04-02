/* Content Script */

chrome.runtime.onMessage.addListener(message_callback);

var video = document.querySelector("video");

function onplay_callback() {
    chrome.runtime.sendMessage({
        status: "played"
    });
}

function onended_callback() {
    chrome.runtime.sendMessage({
        status: "ended"
    });

}

// This function will wait for the video element to come
var observer = setInterval(observe_function, 1000);

function observe_function() {
    if (video) {
        video.addEventListener("play", onplay_callback);
        video.addEventListener("ended", onended_callback);
        clearInterval(observer);
    } else {
        video = document.querySelector("video");
    }
}

function message_callback(message, sender, sendResponse) {
    if (message.action === "pause") {
        video.pause();
    } else if (message.action === "play") {
        video.currentTime = video.currentTime - 0.5;
        video.play();
    }
}