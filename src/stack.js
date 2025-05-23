/* global chrome */

import { getBookmarks, popBookmark } from './shared.js';

var render = function(element, items) {
	if (items.length === 0) {
		element.outerHTML = '<p>No links stored yet.</p>';
	} else {
		element.innerHTML = '';
		items.forEach(item => {
			var icon = document.createElement('img');
			icon.className = 'icon';

			var rootUrl = item.url.split('/').slice(0, 3).join('/');
			if (chrome && typeof browser === 'undefined') {
				var url = new URL(chrome.runtime.getURL('/_favicon/'));
				url.searchParams.set('pageUrl', rootUrl);
				url.searchParams.set('size', '16');
				icon.src = url.toString();
			} else {
				// see https://bugzilla.mozilla.org/show_bug.cgi?id=1315616
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
	}
};

getBookmarks().then(bookmarks => {
	render(document.querySelector('#bookmarks'), bookmarks);
});

document.addEventListener('click', event => {
	if (event.target.tagName === 'A') {
		event.preventDefault();
		popBookmark(event.target.id).then(bookmark => {
			chrome.tabs.create({url: bookmark.url});
		});
	}
});
