'use struct';

const FOLDER_TITLE = 'stack';

var getRootFolder = function(callback) {
	// try firefox
	chrome.bookmarks.get('unfiled_____', function(folder) {
		if (!chrome.runtime.lastError) {
			callback(folder[0]);
		} else {
			// In chrome, it the folders are indexed depth-first.
			// So root is 0, "bookmark bar" is 1, "other bookmarks" is 2.
			// However, if you already had bookmarks when ids were introduced,
			// "other bookmarks" may have a higher id.
			//
			// See https://bugs.chromium.org/p/chromium/issues/detail?id=21330
			chrome.bookmarks.getChildren('0', function(children) {
				callback(children[1]);
			});
		}
	});
};

var ensureFolder = function(callback) {
	getRootFolder(function(root) {
		chrome.bookmarks.getChildren(root.id, function(children) {
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
	});
};

var getBookmarks = function(callback) {
	ensureFolder(function(folder) {
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
	ensureFolder(function(folder) {
		chrome.bookmarks.create({
			parentId: folder.id,
			title: tab.title,
			url: tab.url,
		}, function() {
			updateCount(callback);
		});
	});
};
