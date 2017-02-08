'use struct';

chrome.contextMenus.create({
	title: 'read later',
	contexts: ['page'],
	onclick: function(info, tab) {
		pushBookmark(tab, function() {
			chrome.tabs.remove(tab.id);
		});
	},
});

chrome.contextMenus.create({
	title: 'read link later',
	contexts: ['link'],
	onclick: function(info) {
		pushBookmark({
			url: info.linkUrl,
		});
	},
});

updateCount();
