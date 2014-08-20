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
		title: 'Youtube Video Properties',
		minWidth: 400,
		minHeight: 200,

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
            html: '<h3>Type Search Query Below</h3>' + 
                  '<form id="searchform">' + 
                    '<input id="searchquery" style="width: 50%;" class="cke_dialog_ui_input_text" type="text"/>' + 
                    '<input id="searchbutton" class="cke_dialog_ui_input_submit" type="submit" value="Search"/>' + 
                  '</form>' + 
                  '<div id="searchresults"></div>',
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
                displayResult: function(item) {
                  return '<p><a class="result" data-src="' + item.id.videoId + '" href="http://youtu.be/' + item.id.videoId + '">' + item.snippet.title + '</p>';
                }
              });
              
              // if you click on a search result, its id should populate the
              // search url field on the Basic Settings page
              var dialogObj = this.getDialog();
              
              $('#searchresults').on('click', '.result', function() {
                dialogObj.setValueOf( 'tab-basic', 'src', $(this).data('src'));
                dialogObj.selectPage('tab-basic');
                return false;
              });
            }
          },
		    ]
		  },
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-basic',
				label: 'Basic Settings',

				// The tab contents.
				elements: [
					{
						// Video Width
						type: 'text',
						id: 'width',
						label: 'Width',
						'default': 560,

						// Validation checking whether the field is not empty.
						validate: CKEDITOR.dialog.validate.notEmpty( "Width cannot be empty" ),

						// Called by the main setupContent call on dialog initialization.
						setup: function( element ) {
							this.setValue( element.getAttribute( "width" ) );
						},

						// Called by the main commitContent call on dialog confirmation.
						commit: function ( element ) {
							var id = this.getValue();
							if ( id )
								element.setAttribute( 'width', id );
							else if ( !this.insertMode )
								element.removeAttribute( 'width' );
						}
					},
					{
						// Video Height
						type: 'text',
						id: 'height',
						label: 'Height',
						'default': 315,

						// Validation checking whether the field is not empty.
						validate: CKEDITOR.dialog.validate.notEmpty( "Height cannot be empty" ),

						// Called by the main setupContent call on dialog initialization.
						setup: function( element ) {
							this.setValue( element.getAttribute( "height" ) );
						},

						// Called by the main commitContent call on dialog confirmation.
						commit: function ( element ) {
							var id = this.getValue();
							if ( id )
								element.setAttribute( 'height', id );
							else if ( !this.insertMode )
								element.removeAttribute( 'height' );
						}
					},
					{
						// Source
						type: 'text',
						id: 'src',
						label: 'Source',

						// Validation checking whether the field is not empty.
						validate: CKEDITOR.dialog.validate.notEmpty( "Must have a url link!" ),

						// Called by the main setupContent call on dialog initialization.
						setup: function( element ) {
							this.setValue( element.getAttribute( "src" ) );
						},

						// Called by the main commitContent call on dialog confirmation.
						commit: function ( element ) {
							var id = this.getValue();
							if ( id )
								element.setAttribute( 'src', id );
							else if ( !this.insertMode )
								element.removeAttribute( 'src' );
						}
					}
				]
			},

			// Definition of the Advanced Settings dialog tab (page).
			{
				id: 'tab-adv',
				label: 'Advanced Settings',
				elements: [
					{
						// Another text field for the abbr element id.
						type: 'checkbox',
						id: 'autoplay',
						label: 'Autoplay',
						/*
						onClick: function () {
						  this = CKEDITOR.ui.dialog.checkbox;
						},*/

						// Called by the main setupContent call on dialog initialization.
						setup: function( element ) {
							this.setValue( element.getAttribute( "autoplay" ) );
						},

						// Called by the main commitContent call on dialog confirmation.
						commit: function ( element ) {
							var id = this.getValue();
							if ( id )
								element.setAttribute( 'autoplay', id );
							else if ( !this.insertMode )
								element.removeAttribute( 'autoplay' );
						}
					},
					{
						// Start at
						type: 'text',
						id: 'startat',
						label: 'Start At',

						// Called by the main setupContent call on dialog initialization.
						setup: function( element ) {
							this.setValue( element.getAttribute( "id" ) );
						},

						// Called by the main commitContent call on dialog confirmation.
						commit: function ( element ) {
							var id = this.getValue();
							if ( id )
								element.setAttribute( 'id', id );
							else if ( !this.insertMode )
								element.removeAttribute( 'id' );
						}
					}
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
				element = element.getAscendant( 'youtube-embed', true );

			// Create a new <abbr> element if it does not exist.
			if ( !element || element.getName() != 'youtube-embed' ) {
				element = editor.document.createElement( 'youtube-embed' );

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
