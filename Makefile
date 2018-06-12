.DEFAULT_GOAL := build/export_compiled.js

build/template_compiled.js: template.hbs
	handlebars template.hbs -f build/template_compiled.js

build/export_compiled.js: handlebars.js export.js build/template_compiled.js
	cat handlebars.js export.js build/template_compiled.js > build/export_compiled.js
