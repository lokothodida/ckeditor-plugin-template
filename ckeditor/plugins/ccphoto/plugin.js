/**
  * Register the plugin
  */
CKEDITOR.plugins.add( 'ccphoto', {
	icons: 'ccphoto',
	init: function(editor) {
		editor.addCommand('ccphoto', new CKEDITOR.dialogCommand('ccphotoDialog'));
		editor.ui.addButton('ccphoto', {
			label: 'Insert Creative Commons Image',
			command: 'ccphoto',
			toolbar: 'insert'
		});

		if (editor.contextMenu) {
			editor.addMenuGroup('ccphotoGroup');
			editor.addMenuItem( 'ccphotoItem', {
				label: 'Edit CC Image Properties',
				icon: this.path + 'icons/ccphoto.png',
				command: 'ccphoto',
				group: 'ccphotoGroup'
			});

			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('img', true) && element.hasClass('ccimage')) {
					return { ccphotoItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}

		CKEDITOR.dialog.add( 'ccphotoDialog', this.path + 'dialogs/ccphoto.js' );
	}
});
