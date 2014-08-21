/** YourPlugin helper object */
var _YourPlugin = function(path) {
  /**
   * loads html template from /html folder into a div
   * @param {String}       filename (no .html suffix)
   * @param {jQueryObject} $div container to load contents into
   */
  this.getHtml = function(filename, $div) {
    var file = path + 'html/' + filename + '.html';

    // ajax loads the contents of the file into the div
    $.ajax({
      url: file,
      dataType: 'html',
      success: function(html) {
        $div.html(html);
      },
      error: function() {
        // error handling (e.g. display an error for your user)
        console.log(file + ' does not exist');
      },
    });
  };
};
