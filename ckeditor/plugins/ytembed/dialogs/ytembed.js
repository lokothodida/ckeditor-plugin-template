CKEDITOR.dialog.add('ytembedDialog', function(editor) {
	return {
		title:     'YouTube Video Search',
		minWidth:  500,
		minHeight: 200,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,
		
		contents: [
		  {
		    // Definition of 'Search Youtube' tab
		    id: 'tab-search',
		    label: 'Search YouTube',
		    elements : [
		      {
            type: 'html',
            id: 'searchpage',
            // below defines the basic markup for the dialog.
            // because hitting the enter key closes the dialog, and we want
            // hitting enter to perform the search query, we define an iframe
            // to hold the form, then use jQuery to bind the events between
            // the frame and the dialog.
            html: '<iframe id="searchiframe" src="about:blank"></iframe>' + 
                  '<div id="searchiframecont">' + 
                    '<form id="searchform">' + 
                      '<h2>Embed a video</h2>' +
                      '<p>Type a search term or YouTube URL below, hit the search button, then select a result to embed that video.</p>' +  
                        '<div id="searchwrap">' + 
                          '<input id="searchid" type="hidden"/>' + 
                          '<input id="searchquery" class="cke_dialog_ui_input_text" type="text" placeholder="Search here..."/>' + 
                          '<a id="searchbutton" class="cke_dialog_ui_button cke_dialog_ui_button_ok">&#xf002;</a>' + 
                        '</div>' +
                    '</form>' + 
                  '</div>' +
                  '<ul id="searchresults"></ul>',
            onLoad: function() {
              // select the frame content
              var content = $('#searchiframecont').show();
              var searchiframe = $('#searchiframe').contents();
              
              // dump the frame content into the iframe, putting in any header scripts and css
              // also reset the body's css
              searchiframe.find('body').append('<div id="searchiframecont">' + content.html() + '</div>');
              searchiframe.find('head').append($('head script, head link').clone());
              searchiframe.find('head').append(
                '<script src="' + CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ytembed/js/ytsearch.js"></script>' +
                '<script src="' + CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ytembed/js/ytembed.js"></script>'
              );
              
              // reset the frame body's css and hide the original form
              searchiframe.find('body').css({
                padding: 0,
                width: '100%',
              });
              content.hide();
              
              // now bind youtube search functionality to the search box from
              // within the iframe
              var framecont = searchiframe.find('#searchiframecont');
              var form = framecont.find('#searchform');
              var query = form.find('#searchquery');
              var button = form.find('#searchbutton');
              
              searchiframe.find('#searchform').ytsearch({
                apiKey: googleApiKey,
                classes: {
                  query:    query,                // bound to query inside the frame
                  results:  $('#searchresults'),  // bound to results box outside the frame
                  button:   button,               // bound to button inside the frame
                },
                params: {
                  type: 'video',                  // excludes playlists and channels
                },
                noResults: '<p class="noresults">Sorry, no results.</p>',
                displayResult: function(item) {
                  return '<li class="result" data-src="' + item.id.videoId + '">' +
                            '<img class="thumbnail" src="' + item.snippet.thumbnails.medium.url + '">' +
                            '<h2>' + item.snippet.title + '</h2>' +
                            '<p>' + item.snippet.description + '</p>' +
                         '</li>';
                }
              });
              
              // when enter key is hit, simulate clicking the search button
              searchiframe.on('submit', '#searchform', function() {
                $(this).find('#searchbutton').click();
                return false;
              });
                            
              // if you click on a search result, its id should populate the
              // search field and the OK button should be clicked
              $('#searchresults').on('click', '.result', function() {
                searchiframe.find('#searchid').val($(this).data('src'));
                var ckDialog = window.CKEDITOR.dialog.getCurrent()
                var ckOk = ckDialog._.buttons['ok'];
                ckOk.click();
                return false;
              });
              
            },
            setup: function(element) {
              // if we are editing a video, its src should populate the query
              var frameForm = $('#searchiframe').contents().find('#searchiframecont');
              frameForm.find('#searchquery').val(element.data('src'));
              
              // simulate search so that first result is the edited video
              frameForm.find('form').submit();
            },
            commit: function (element) {
              // saving changes
              var framecontent = $('#searchiframe').contents().find('#searchiframecont');

              // use the searchid if it has been set
							var value = framecontent.find('#searchid').val();
							if (!value)
							  value = framecontent.find('#searchquery').val();
							
							if (value) 
								element.setAttribute('data-src', value);
							else if (!this.insertMode)
								element.removeAttribute('data-src');
						}
          },
		    ]
		  }
		],
		
    onShow: function() {
			var selection = editor.getSelection();
      var element = selection.getStartElement();
      if (element)
				element = element.getAscendant('div', true);

			// create new div if it doesn't exist
			if (
			  !element || 
			  !element.hasAttribute('data-youtube-embed')
			) {
				element = editor.document.createElement('div');
        element.data('youtube-embed', true);
        this.insertMode = true;
			}
			else
				this.insertMode = false;

			this.element = element;

			if (!this.insertMode)
				this.setupContent(this.element);
		},
		
    onOk: function() {
			var dialog = this;
      var ytembed = this.element;
      this.commitContent(ytembed);
      if (this.insertMode)
				editor.insertElement(ytembed);
		}
	};
});
