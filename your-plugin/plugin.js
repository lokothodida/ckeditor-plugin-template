(function() {
// plugin meta-information
var plugin = {};
plugin.id = 'your-plugin';
plugin.title = 'Your Plugin';
plugin.label = 'Your Plugin Label';
plugin.command = 'yourPlugin'; // camel cased
plugin.dialog = plugin.command + 'Dialog';
plugin.group = plugin.command + 'Group';
plugin.item = plugin.command + 'Item';
plugin.toolbar = 'insert';
plugin.divData = 'data-' + plugin.id;
plugin.fakeImageClass = 'cke_' + plugin.id;

// function to determine if selected element is of the type required for our dialog
var isCorrectElementType = function(element) {
  if (element && element.is) {
    // we are editing an existing element
    return element.is('img') &&
           element.data('cke-real-element-type') == 'div' &&
           element.hasClass(plugin.fakeImageClass);
  } else if (element && element.attributes) {
    // we are converting source code div to fake item
    return element.attributes[plugin.divData];
  } else {
    return false;
  }
};

CKEDITOR.plugins.add(plugin.id, {
  details: plugin,  // hooks information so we can use it in the dialog
  requires: 'dialog,fakeobjects',
  icons: plugin.id,

  init: function(editor) {
    editor.addCommand(plugin.command, new CKEDITOR.dialogCommand(plugin.dialog));
    editor.ui.addButton(plugin.id, {
      label: plugin.label,
      command: plugin.command,
      toolbar: plugin.toolbar,
    });

    if (editor.contextMenu) {
      editor.addMenuGroup(plugin.group);
      editor.addMenuItem(plugin.item, {
        label: plugin.label,
        icon: this.path + 'icons/' + plugin.id + '.png',
        command: plugin.command,
        group: plugin.group
      });

      editor.contextMenu.addListener(function(element) {
        if (isCorrectElementType(element)) {
          var object = {};
          object[plugin.item] = CKEDITOR.TRISTATE_OFF;

          return object;
        }
      });
    }

    // ensure the contents css is an array
    if (!Array.isArray(CKEDITOR.config.contentsCss)) {
      CKEDITOR.config.contentsCss = [CKEDITOR.config.contentsCss];
    }

    var css = [
      this.path + 'css/contents.css',
    ];

    // only load css if they aren't already in the array
    for (i in css) {
      if (CKEDITOR.config.contentsCss.indexOf(css[i]) < 0) {
        CKEDITOR.config.contentsCss.push(css[i]);
      }
    }

    // add your dialogs
    CKEDITOR.dialog.add(plugin.dialog, this.path + 'dialogs/main.js');
  },

  afterInit: function(editor) {
    var dataProcessor = editor.dataProcessor;
    var dataFilter = dataProcessor && dataProcessor.dataFilter;

    if (dataFilter) {
      dataFilter.addRules({
        elements: {
          div: function(element) {
            var returnedElement = element;

            if (isCorrectElementType(element)) {
              returnedElement = editor.createFakeParserElement(element, plugin.fakeImageClass, 'div', false);
            }

            return returnedElement;
          }
        }
      });
    }
  }
});
})();
