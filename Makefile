bookmark-stack.zip: manifest.json src icons/icon-16.png icons/icon-48.png icons/icon-128.png
	zip -r -FS $@ $^

icons/icon-16.png: icons/icon.svg
	convert -resize 16x -background transparent $< $@

icons/icon-48.png: icons/icon.svg
	convert -resize 48x -background transparent $< $@

icons/icon-128.png: icons/icon.svg
	convert -resize 128x -background transparent $< $@
