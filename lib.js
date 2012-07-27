var async = require("async");
var fs = require("fs");
var path = require("path");

var scoutDir = function (dir, ext, templates, _cb) {
	fs.readdir(dir, function (err, files) {
		if (err) return _cb(err);

		async.forEach(files, addFile(dir, ext, templates), _cb);
	});
};

var addFile = function (dir, ext, templates) {
	return function (file, _cb) {
		var filePath = path.join(dir, file);
		var fileName = path.basename(file, ext);

		fs.stat(filePath, function (err, stats) {
			if (err) return _cb(err);

			if (stats.isDirectory()) {
				var newDir = path.join(dir, file);
				
				templates[file] = {};

				scoutDir(newDir, ext, templates[file], _cb);
			} else if (path.extname(file) === ext) {
				fs.readFile(filePath, "utf8", function (err, data) {
					if (err) return _cb(err);

					templates[fileName] = data;

					_cb();
				});
			} else {
				_cb();
			}
		});
	};
};

var middleware = function (opts) {
	if (!opts) opts = {};

	if (!opts.src) throw new Error("Must provide source directory.");
	if (!opts.dest) throw new Error("Must provide destination path.");

	if (!opts.ext) opts.ext = ".ejs";
	if (!opts.varName) opts.varName = "Templates";

	return function (req, res, next) {
		var templates = {};

		scoutDir(opts.src, opts.ext, templates, function (err) {
			if (err) return next(err);

			var scriptFile = "var " + opts.varName + " = " + JSON.stringify(templates) + ";";

			fs.writeFile(opts.dest, scriptFile, next);
		});
	};
};

module.exports = middleware;