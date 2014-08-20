CKEDITOR.plugins.add('oxpoints', {
	icons: 'oxpoints',
	init: function(editor) {
		editor.addCommand( 'oxpoints', new CKEDITOR.dialogCommand('oxpointsDialog'));
		editor.ui.addButton( 'oxpoints', {
			label: 'Insert OxPoint Location',
      command: 'oxpoints',
      toolbar: 'insert'
		});

		if (editor.contextMenu) {
			editor.addMenuGroup( 'oxpointsGroup' );
			editor.addMenuItem( 'oxpointsItem', {
				label: 'Edit OxPoint',
				icon: this.path + 'icons/oxpoints.png',
				command: 'oxpoints',
				group: 'oxpointsGroup'
			});

			editor.contextMenu.addListener( function( element ) {
				if (element.getAscendant('div', true) && element.hasClass('oxpoint')) {
					return { oxpointsItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}
		
    CKEDITOR.dialog.add( 'oxpointsDialog', this.path + 'dialogs/oxpoints.js' );
	}
});

