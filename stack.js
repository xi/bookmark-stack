'use struct';

var render = function(element, items) {
	element.innerHTML = '';
	items.forEach(function(item) {
		var icon = document.createElement('img');
		icon.className = 'icon';

		if (chrome && !browser) {
			icon.src = 'chrome://favicon/' + item.url;
		} else {
			var rootUrl = item.url.split('/').slice(0, 3).join('/');
			icon.src = rootUrl + '/favicon.ico';
		}

		var a = document.createElement('a');
		a.id = item.id;
		a.href = item.url;
		a.title = item.url;
		a.textContent = item.title || item.url;
		a.prepend(icon);

		var li = document.createElement('li');
		li.appendChild(a);

		// reverse
		element.prepend(li);
	});
};

getBookmarks(function(bookmarks) {
	render(document.querySelector('#bookmarks'), bookmarks);
});

document.addEventListener('click', function(event) {
	if (event.target.tagName === 'A') {
		event.preventDefault();
		popBookmark(event.target.id, function(bookmark) {
			chrome.tabs.create({url: bookmark.url});
		});
	}
});
