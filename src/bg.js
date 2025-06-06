/* global chrome */

import { pushBookmark, updateCount } from './shared.js';

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'read-later',
		title: 'read later',
		contexts: ['page', 'selection', 'editable', 'image'],
	});

	try {
		chrome.contextMenus.create({
			id: 'read-later',
			title: 'read later',
			contexts: ['tab'],
		});
	} catch {}

	chrome.contextMenus.create({
		id: 'read-later-link',
		title: 'read link later',
		contexts: ['link'],
	});

	updateCount();
});

chrome.runtime.onStartup.addListener(() => {
	updateCount();
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

chrome.commands.onCommand.addListener(async function(name, tab) {
	if (name === 'push-bookmark') {
		await pushBookmark(tab);
		await chrome.tabs.remove(tab.id);
	}
});
