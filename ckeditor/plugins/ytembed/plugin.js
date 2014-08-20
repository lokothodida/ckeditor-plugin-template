/**
  * Title:        YouTubeEmbed (ytEmbed)
  * Description:  Search for and embed YouTube videos from within CKEditor
  * Author:       Lawrence Okoth-Odida
  * Version:      0.1
  * Date:         04/06/2014
  * Notes:        Created using the abbr sample plugin on CKEditor Documentation
 */
CKEDITOR.plugins.add('ytembed', {
  icons: 'youtube',

	init: function(editor) {
		editor.addCommand('ytembed', new CKEDITOR.dialogCommand('ytembedDialog'));
    editor.ui.addButton( 'Youtube', {
      label: 'Embed Youtube Video',
      command: 'ytembed',
      toolbar: 'insert'
		});

    // add context menu for editing a video link
		if (editor.contextMenu) {
			editor.addMenuGroup('ytembedGroup');
			
			editor.addMenuItem( 'ytembedItem', {
				label: 'Edit Video',
				icon: this.path + 'icons/youtube.png',
				command: 'ytembed',
				group: 'ytembedGroup'
			});

			editor.contextMenu.addListener(function(element) {
			  if (element.getAscendant('div', true) && element.hasAttribute('data-youtube-embed')) {
					return { ytembedItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}

		// register dialog
		CKEDITOR.dialog.add( 'ytembedDialog', this.path + 'dialogs/ytembed.js' );
	}
});

