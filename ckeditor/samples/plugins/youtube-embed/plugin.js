CKEDITOR.plugins.add( 'youtube-embed', {
	icons: 'youtube-embed',
	init: function( editor ) {
		// dialogs
		editor.addCommand( 'youtubeEmbedDialog', new CMEDITOR.dialogCommand( 'youtubeEmbedDialog' ) );
		editor.ui.addButton(
			label:		'Embed Youtube Video',
			command:	'embedYoutubeDialog',
			toolbar:	'insert'
		); // end addButton
	} // end init
}); // end add
