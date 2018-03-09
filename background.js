/* Background Script */

/* Event listeners defined here */
chrome.runtime.onMessage.addListener(message_function);
chrome.tabs.onActivated.addListener(activate_function);
chrome.tabs.onRemoved.addListener(remove_function);
chrome.tabs.onUpdated.addListener(update_function);


/* Initialize variables */
var playing_tab_id = undefined;
var playing_tab_window_id = undefined;
var map = new Map();

chrome.browserAction.setBadgeBackgroundColor({
    color: [47, 47, 47, 255]
});
chrome.browserAction.setBadgeText({
    text: "" + map.size
});


function message_function(message, sender, sendResponse) {

    //console.log(message.status);

    if (message.status === "played") {

        //console.log("played 0 " + playing_tab_window_id + " " + sender.tab.windowId);

        if (playing_tab_window_id !== sender.tab.windowId) {

            if (playing_tab_id !== undefined) {
                chrome.tabs.sendMessage(playing_tab_id, {
                    action: "pause"
                });

            }

            playing_tab_id = sender.tab.id;
            playing_tab_window_id = sender.tab.windowId;

            //console.log("played 1 " + playing_tab_window_id);

        } else if (playing_tab_id !== sender.tab.id) {

            if (playing_tab_id !== undefined) {
                chrome.tabs.sendMessage(playing_tab_id, {
                    action: "pause"
                });

            }

            playing_tab_id = sender.tab.id;
            playing_tab_window_id = sender.tab.windowId;

            //console.log("played 2 " + playing_tab_window_id);
        }


        if (!map.has(sender.tab.id)) {

            map.set(sender.tab.id, sender.tab);
            chrome.browserAction.setBadgeText({
                text: "" + map.size
            });
        }

    } else if (message.status === "ended") {

        //console.log("2 ended");

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

        //console.log("3 playing_tab_id: "+playing_tab_id+" info.tabId :"+info.tabId);

        playing_tab_id = info.tabId;
        playing_tab_window_id = info.windowId;

        chrome.tabs.sendMessage(playing_tab_id, {
            action: "play"
        });

    }

}


function remove_function(tabId, removeInfo) {

    if (map.has(tabId)) {

        map.delete(tabId);
        chrome.browserAction.setBadgeText({
            text: "" + map.size
        });
    }
}


function update_function(tabId, changeInfo, tab) {

    if (map.has(tabId) && changeInfo.url !== undefined) {

        map.delete(tabId);
        chrome.browserAction.setBadgeText({
            text: "" + map.size
        });


        chrome.tabs.sendMessage(tabId, {
            action: "update_var"
        });

    }
}

