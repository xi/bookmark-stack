'use struct';

var popBookmark = function(id, callback) {
	chrome.bookmarks.get(id, function(items) {
		chrome.bookmarks.remove(id, function() {
			callback(items[0].url);
		});
	});
};

var render = function(element, items) {
	element.innerHTML = '';
	items.forEach(function(item) {
		var icon = document.createElement('img');
		icon.className = 'icon';
		icon.src = 'chrome://favicon/' + item.url;

		var a = document.createElement('a');
		a.id = item.id;
		a.href = item.url;
		a.title = item.url;
		a.textContent = item.title || item.url;
		a.prepend(icon);

		var li = document.createElement('li');
		li.appendChild(a);

		element.appendChild(li);
	});
}

ensureFolder(FOLDER_ID, function(folder) {
	chrome.bookmarks.getChildren(folder.id, function(children) {
		render(document.querySelector('#bookmarks'), children);
	});
});

document.addEventListener('click', function(event) {
	if (event.target.tagName === 'A') {
		event.preventDefault();
		popBookmark(event.target.id, function(url) {
			chrome.tabs.create({url: url})
		});
	}
});
