import { pushBookmark, updateCount } from './shared.js';

chrome.contextMenus.create({
	id: 'read-later',
	title: 'read later',
	contexts: ['page', 'selection', 'editable', 'image', 'tab'],
});

chrome.contextMenus.create({
	id: 'read-later-link',
	title: 'read link later',
	contexts: ['link'],
});

chrome.contextMenus.onClicked.addListener(async function(info, tab) {
	if (info.menuItemId === 'read-later-link') {
		await pushBookmark({
			url: info.linkUrl,
			title: info.linkText,
		});
	} else {
		await pushBookmark(tab);
		await chrome.tabs.remove(tab.id);
	}
});

updateCount();
