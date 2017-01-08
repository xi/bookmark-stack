'use struct';

const FOLDER_ID = '2';
const FOLDER_TITLE = 'stack';

var ensureFolder = function(parentId, callback) {
	chrome.bookmarks.getChildren(parentId, function(children) {
		var folder = children.find(child => child.title === FOLDER_TITLE);
		if (!folder) {
			chrome.bookmarks.create({
				parentId: parentId,
				title: FOLDER_TITLE,
			}, callback);
		} else {
			callback(folder);
		}
	});
};

var getBookmarks = function(callback) {
	ensureFolder(FOLDER_ID, function(folder) {
		chrome.bookmarks.getChildren(folder.id, callback);
	});
};

var updateCount = function(callback) {
	getBookmarks(function(bookmarks) {
		chrome.browserAction.setBadgeText({text: '' + bookmarks.length});
		if (callback) callback();
	});
};

var popBookmark = function(id, callback) {
	chrome.bookmarks.get(id, function(items) {
		chrome.bookmarks.remove(id, function() {
			updateCount(function() {
				callback(items[0]);
			});
		});
	});
};

var pushBookmark = function(tab, callback) {
	ensureFolder(FOLDER_ID, function(folder) {
		chrome.bookmarks.create({
			parentId: folder.id,
			title: tab.title,
			url: tab.url,
			// tab.favIconUrl
		}, function() {
			updateCount(callback);
		});
	});
};
