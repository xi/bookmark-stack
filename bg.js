'use struct';

chrome.contextMenus.create({
	title: 'read later',
	onclick: function(info, tab) {
		pushBookmark(tab, function() {
			chrome.tabs.remove(tab.id);
		});
	},
});

updateCount();
