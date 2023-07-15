chrome.contextMenus.create({
	id: 'read-later',
	title: 'read later',
	contexts: ['page', 'selection', 'editable', 'image', 'tab'],
});

chrome.contextMenus.create({
	id: 'read-later-link',
	title: 'read link later',
	contexts: ['link'],
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId === 'read-later-link') {
		pushBookmark({
			url: info.linkUrl,
			title: info.linkText,
		});
	} else {
		pushBookmark(tab, function() {
			chrome.tabs.remove(tab.id);
		});
	}
});

updateCount();
