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
