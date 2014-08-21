(function() {
// get plugin path
var path = CKEDITOR.plugins.get('your-plugin').path;

// get plugin details (defined in plugin.js)
var plugin = CKEDITOR.plugins.registered['your-plugin'].details;

// css
CKEDITOR.document.appendStyleSheet(CKEDITOR.getUrl(path + 'css/dialog.css'));

// javascript
CKEDITOR.scriptLoader.load(path + 'js/helper-methods.js');

// register dialog
CKEDITOR.dialog.add(plugin.dialog, function(editor) {
  return {
    title: plugin.title,
    minWidth: 350,
    minHeight: 200,

    contents: [
      // tabs
      {
        id: 'tab1',
        label: 'text',
        elements: [
          // fields
          {
            id: 'attribute-1',
            type: 'text',
            label: 'Element 1',
            className: 'attribute-1',
            onLoad: function() {
              // any manipulations needed to the field
            },
            setup: function(element) {
              // pull information from the element
              this.setValue(element.getAttribute('data-attribute-1'));
            },
            commit: function(element) {
              // stick the user input into the element
              element.setAttribute('data-attribute-1', this.getValue());
            }
          },
          // add more fields below
        ],
      },
      // add more tabs below
    ],

    onLoad: function() {
      // add id for easier styling of elements in the dialog
      $(this.getElement()).attr('id', plugin.dialog);

      // initialize YourPlugin object
      YourPlugin = new YourPlugin(path);
    },

    onShow: function() {
      var fakeImage = this.getSelectedElement();

      if (fakeImage && fakeImage.data('cke-real-element-type') && fakeImage.data('cke-real-element-type') == 'div') {
        this.fakeImage = fakeImage;
        this.node = editor.restoreRealElement(fakeImage);
        this.insertMode = false;
        this.setupContent(this.node);
      } else {
        this.insertMode = true;
      }
    },

    onOk: function() {
      var node = (!this.fakeImage)? new CKEDITOR.dom.element('div') : this.node;
      node.setAttribute(plugin.divData, 'true');

      this.commitContent(node);
      var newFakeImage = editor.createFakeElement(node, plugin.fakeImageClass, 'div', false);

      if (this.fakeImage) {
        newFakeImage.replace(this.fakeImage);
        editor.getSelection().selectElement(newFakeImage);
      } else {
        editor.insertElement(newFakeImage);
      }
    }
  }
});
})();
