/* Background Script */

chrome.runtime.onMessage.addListener(message_function);
chrome.tabs.onActivated.addListener(activate_function);
chrome.tabs.onRemoved.addListener(remove_function);
chrome.webNavigation.onHistoryStateUpdated.addListener(url_update_function);

var playing_tab_id;
var playing_tab_window_id;
var focused_tab_id;
var map = new Map();

chrome.browserAction.setBadgeBackgroundColor({
    color: [47, 47, 47, 255]
});
chrome.browserAction.setBadgeText({
    text: "" + map.size
});

function message_function(message, sender, sendResponse) {

    if (message.status === "played") {

        if (playing_tab_window_id !== sender.tab.windowId) {
            if (playing_tab_id !== undefined) {
                chrome.tabs.sendMessage(playing_tab_id, {
                    action: "pause"
                });
            }
            playing_tab_id = sender.tab.id;
            playing_tab_window_id = sender.tab.windowId;
            
        } else if (playing_tab_id !== sender.tab.id && focused_tab_id == sender.tab.id) {
            if (playing_tab_id !== undefined) {
                chrome.tabs.sendMessage(playing_tab_id, {
                    action: "pause"
                });
            }
            playing_tab_id = sender.tab.id;
            playing_tab_window_id = sender.tab.windowId;
        }

        if (!map.has(sender.tab.id)) {
            map.set(sender.tab.id, sender.tab);
            chrome.browserAction.setBadgeText({
                text: "" + map.size
            });
        }

    } else if (message.status === "ended") {

        if (map.has(sender.tab.id)) {
            map.delete(sender.tab.id);
            chrome.browserAction.setBadgeText({
                text: "" + map.size
            });
        }
    }
}

function activate_function(info) {
    if (map.has(info.tabId) && info.tabId !== playing_tab_id) {
        if (playing_tab_id !== undefined) {
            chrome.tabs.sendMessage(playing_tab_id, {
                action: "pause"
            });
        }
        playing_tab_id = info.tabId;
        playing_tab_window_id = info.windowId;
        chrome.tabs.sendMessage(playing_tab_id, {
            action: "play"
        });
    }
    focused_tab_id = info.tabId;
}

function remove_function(tabId, removeInfo) {
    if (map.has(tabId)) {
        map.delete(tabId);
        chrome.browserAction.setBadgeText({
            text: "" + map.size
        });
    }
}

function url_update_function(details) {
    if (map.has(details.tabId)) {
        map.delete(details.tabId);
        chrome.browserAction.setBadgeText({
            text: "" + map.size
        });
    }
}