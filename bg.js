'use struct';

chrome.contextMenus.create({
	title: 'read later',
	onclick: function(info, tab) {
		ensureFolder(FOLDER_ID, function(folder) {
			chrome.bookmarks.create({
				parentId: folder.id,
				title: tab.title,
				url: tab.url,
				// tab.favIconUrl
			}, function() {
				chrome.tabs.remove(tab.id);
			});
		});
	},
});
