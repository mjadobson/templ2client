templ2client
============

Intro
-----

This is a simple middleware that collects all of the template files in a directory and turns them into a client file with a corresponding nested template object.

Thus, a directory like this...

	views/
		posts/
			add.ejs
			edit.ejs
			view.ejs
		users/
			list.ejs
			view.ejs
		index.ejs
		layout.ejs

...will be transformed into this:

	var Templates = {
		posts: {
			add: "..",
			edit: "..",
			view: ".."
		},
		users: {
			list: "..",
			view: ".."
		},
		index: "..",
		layout: ".."
	};

Usage
-----

Simply add the middleware before your static provider and router:

	app.use(templ2client({
		src: __dirname + "/views",
		dest: __dirname + "/public/javascripts/templates.js"
	}));
	app.use(express.static(__dirname + "/public"));
	app.use(app.router);

Then include the generated script file in your html:

	<script src="/javascripts/templates.js"></script>

Config
------

* `src`: Source directory of files. (Required)
* `dest`: Destination path for generated file. (Required)
* `ext`: File extension to look for. (Default = ".ejs")
* `varName`: Client's variable name for templates object. (Default = "Templates")

Todo
----

* Write tests
* Caching
* Black/Whitelisting
* Provide hook to compile template files (eg: .jade)