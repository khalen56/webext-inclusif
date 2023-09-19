browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "inclusive",
    title: "En Inclusif",
    contexts: ["selection"],
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  const id = info.menuItemId;
  if (items[id]) {
    items[id].cb({replace: items[id].word})
  }
});

let items = {};

browser.runtime.onMessage.addListener(function(event, sender, sendResponse) {
  if (event.name === "contextmenu" && event.data && event.data.length) {
    fetch("https://inclusif.khalen.xyz/" + encodeURIComponent(event.data), {
      "method": "GET"
    })
    .then(function(response){return response.json();})
    .then(function(data) {
      Object.keys(items).forEach((item) => browser.contextMenus.remove(item));
      items = {};
      data.data.forEach((item, i) => {
        const id = "inclusive_submenu_" + i;
        addToMenu(id, item.inclusif, sendResponse);

        if (item.pluriel) {
          let pluriel = item.pluriel;
          if (!item.masculin.match(/(x|s)$/)) {
            pluriel = "·" + pluriel;
          }

          addToMenu(id + "_pluriel", item.inclusif + pluriel, sendResponse);
        }
      });
      browser.contextMenus.refresh()
    });
    return true;
  }
});

function addToMenu(id, word, cb) {
  browser.contextMenus.create({
    id: id,
    parentId: "inclusive",
    title: word,
    contexts: ["selection"]
  });

  items[id] = {
    id, word, cb
  };
}