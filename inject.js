window.addEventListener('contextmenu', e => {
  if (e.isTrusted && !e.defaultPrevented) {
    const sending = browser.runtime.sendMessage(
      {"name": "contextmenu", "data": getSelectionText()}
    ).then(response => {
      const first = document.activeElement.value.slice(0, document.activeElement.selectionStart);
      const rest = document.activeElement.value.slice(document.activeElement.selectionEnd, document.activeElement.value.length);

      document.execCommand('selectAll');
      document.execCommand('insertText', false, first + response.replace + rest);

      // Bonus: place cursor behind replacement
      document.activeElement.selectionEnd = (first + response.replace).length;
    })
  }
});

function getSelectionText() {
    let text = "";
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}