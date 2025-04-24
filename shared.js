/* global chrome */

const FOLDER_TITLE = 'stack';

var getRootFolder = async function() {
	try {
		var folder = await chrome.bookmarks.get('unfiled_____');
		return folder[0];
	} catch {
		// In chrome, it the folders are indexed depth-first.
		// So root is 0, "bookmark bar" is 1, "other bookmarks" is 2.
		// However, if you already had bookmarks when ids were introduced,
		// "other bookmarks" may have a higher id.
		//
		// See https://bugs.chromium.org/p/chromium/issues/detail?id=21330
		var children = await chrome.bookmarks.getChildren('0');
		return children[1];
	}
};

var ensureFolder = async function() {
	var root = await getRootFolder();
	var children = await chrome.bookmarks.getChildren(root.id);
	var folder = children.find(child => child.title === FOLDER_TITLE);
	if (!folder) {
		return await chrome.bookmarks.create({
			parentId: root.id,
			title: FOLDER_TITLE,
		});
	} else {
		return folder;
	}
};

export var getBookmarks = async function() {
	var folder = await ensureFolder();
	return await chrome.bookmarks.getChildren(folder.id);
};

export var updateCount = async function() {
	var bookmarks = await getBookmarks();
	chrome.action.setBadgeText({text: '' + bookmarks.length});
	chrome.action.setBadgeBackgroundColor({
		color: bookmarks.length === 0 ? '#6b6b6b' : null
	});
};

export var popBookmark = async function(id) {
	var items = await chrome.bookmarks.get(id);
	await chrome.bookmarks.remove(id);
	await updateCount();
	return items[0];
};

export var pushBookmark = async function(tab) {
	var folder = await ensureFolder();
	var url = tab.url;
	if (tab.isInReaderMode) {
		var _url = new URL(url);
		var _search = new URLSearchParams(_url.search);
		url = _search.get('url');
	}
	await chrome.bookmarks.create({
		parentId: folder.id,
		title: tab.title,
		url: url,
	});
	await updateCount();
};
