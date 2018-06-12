.DEFAULT_GOAL := build/export_compiled.js

build/template_compiled.js: template.hbs
	handlebars template.hbs -f build/template_compiled.js

build/export_compiled.js: handlebars.js export.js build/template_compiled.js
	cat handlebars.js export.js build/template_compiled.js > build/export_compiled.js

dist/dndbeyond_extension.crx:
	rm -rf dist/dndbeyond_extension.csx
	/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=/Users/alex/Documents/projects/personal/dndbeyond_extension --pack-extension-key=/Users/alex/Documents/projects/personal/dndbeyond_extension.pem
	mv /Users/alex/Documents/projects/personal/dndbeyond_extension.crx dist/dndbeyond_extension.crx



