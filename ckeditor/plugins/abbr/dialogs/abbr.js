/**
 * The abbr dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add( 'abbrDialog', function( editor ) {
	return {

		// Basic properties of the dialog window: title, minimum size.
		title: 'Youtube Video Search',
		minWidth: 500,
		minHeight: 200,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,

		// Dialog window contents definition.
		contents: [
		  {
		    // Definition of 'Search Youtube' tab
		    id: 'tab-search',
		    label: 'Search Youtube',
		    elements : [
		      {
            type: 'html',
            id: 'searchpage',
            html: '<form id="searchform">' + 
                    '<h2>Embed a video</h2>' +
                    '<p>Type a search term or Youtube URL below, hit the search button, then select a result to embed that video.</p>' +  
                      '<div id="searchwrap">' + 
                        '<input id="searchid" type="hidden"/>' + 
                        '<input id="searchquery" class="cke_dialog_ui_input_text" type="text" placeholder="Search here..."/>' + 
                        '<a id="searchbutton" class="cke_dialog_ui_button cke_dialog_ui_button_ok">&nbsp;</a>' + 
                      '</div>' +
                  '</form>' + 
                  '<ul id="searchresults"></ul>',
            onShow: function() {
              CKEDITOR.scriptLoader.load(CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'abbr/js/ytsearch.js' );
            
              // bind youtube search functionality to the search box
              $('#searchform').ytsearch({
                apiKey: 'AIzaSyDov_EJkjxi_Qqu8oS4YFoH8TFp9eGKXBY',
                classes: {
                  query:      '#searchquery',
                  order:      '#order',
                  results:    '#searchresults',
                  maxResults: '#maxresults',
                  button:     '#searchform #searchbutton',
                },
                params: {
                  type: 'video',
                },
                displayResult: function(item) {
                  return '<li class="result" data-src="' + item.id.videoId + '"><img class="thumbnail" src="' + item.snippet.thumbnails.medium.url + '"><h2>' + item.snippet.title + '</h2><p>' + item.snippet.description + '</p></li>';
                }
              });
              
              // if you click on a search result, its id should populate the
              // search url field on the Basic Settings page
              var dialogObj = this.getDialog();
              
              
              
              
              $('#searchresults').on('click', '.result', function() {
                $('#searchid').val($(this).data('src'));
                var ckDialog = window.CKEDITOR.dialog.getCurrent(),
                    ckOk = ckDialog._.buttons['ok'];
                ckOk.click();
                               
                //dialogObj.setValueOf( 'tab-basic', 'src', $(this).data('src'));
                //dialogObj.selectPage('tab-basic');
                return false;
              });
            },

						setup: function(element) {
						  $('#searchquery').val(element.data('src'));
            },
            
            commit: function (element) {
							var value = $('#searchid').val();
							if (!value)
							  value = $('#searchquery').val();
							
							if (value) 
								element.setAttribute('data-src', value);
							else if (!this.insertMode)
								element.removeAttribute('data-src');
						}
          },
		    ]
		  }
		],

		// Invoked when the dialog is loaded.
		onShow: function() {

			// Get the selection in the editor.
			var selection = editor.getSelection();

			// Get the element at the start of the selection.
			var element = selection.getStartElement();

			// Get the <abbr> element closest to the selection, if any.
			if ( element )
				element = element.getAscendant( 'div', true );

			// Create a new <abbr> element if it does not exist.
			if ( !element || !element.hasClass('youtube-embed') || !element.hasAttribute('data-youtube-embed')) {
				element = editor.document.createElement( 'div' );
        element.addClass('youtube-embed');
        element.data('youtube-embed', true);

				// Flag the insertion mode for later use.
				this.insertMode = true;
			}
			else
				this.insertMode = false;

			// Store the reference to the <abbr> element in an internal property, for later use.
			this.element = element;

			// Invoke the setup methods of all dialog elements, so they can load the element attributes.
			if ( !this.insertMode )
				this.setupContent( this.element );
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {

			// The context of this function is the dialog object itself.
			// http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
			var dialog = this;

			// Creates a new <abbr> element.
			var ytembed = this.element;

			// Invoke the commit methods of all dialog elements, so the <abbr> element gets modified.
			this.commitContent( ytembed );

			// Finally, in if insert mode, inserts the element at the editor caret position.
			if ( this.insertMode )
				editor.insertElement( ytembed );
		}
	};
});
