(function() {
  // get /oxpoints paths
  var h = CKEDITOR.plugins.get('oxpoints');
  var path = h.path;
  
  // load css and javascript files
  CKEDITOR.document.appendStyleSheet(CKEDITOR.getUrl(h.path + "css/dialog.css"));
  CKEDITOR.document.appendStyleSheet(CKEDITOR.getUrl(h.path + "css/oxpoints.css"));
  CKEDITOR.scriptLoader.load('http://static.data.ox.ac.uk/lib/jquery-ui/jquery-ui.min.js');
  CKEDITOR.scriptLoader.load(path + '/js/jquery.gomap-1.3.2.min.js');
  CKEDITOR.scriptLoader.load(path + '/js/jquery.oxpauto-0.1.js');
  CKEDITOR.scriptLoader.load(path + '/js/jquery.oxpointmap-0.1.js');
	  
  CKEDITOR.dialog.add('oxpointsDialog', function(editor) {
	  return {
		  title: 'OxPoint Locator',
		  minWidth: 350,
		  minHeight: 200,

		  contents: [
			  {
				  id: 'locator',
				  label: 'OxPoint Locator',

				  elements: [
				    {
				      type: 'html',
				      id: 'textinput',
				      html: 
				            '<div id="oxpoints">' +
				              '<h2 id="oxpoints" name="oxpoints">Oxpoints finder</h2>' +
                      '<p>Start typing the name of a unit to get its OxPoints URI</p>' +
                      '<input placeholder="Search name of a department/college etc..." class="cke_dialog_ui_input_text" id="oxpointurifield" data-autocomplete-type="organization">' +
                      '<div class="oxpoint"></div>' +
                    '</div>',
              setup: function(element) {
                // set the oxpoint div's uri to the correct one and let the placeholder
                // be the name of the entry previously searched
                var uri = element.getAttribute('data-uri');
                $('#oxpointurifield').attr('placeholder', element.getAttribute('data-searched'));
                $('.oxpoint').attr('data-uri', uri);
              },
              commit: function(element) {
                var oxpoint = $('.oxpoint');
                element.setAttribute('data-uri', oxpoint.data('uri'));
                element.setAttribute('data-searched', $('#oxpointurifield').val());
              }
				    },
					  {
              type: 'checkbox',
              id: 'inc-map',
              label: 'Include map?',
              setup: function(element) {
                this.setValue(element.getAttribute('data-inc-map') == 'true');
              },
              commit: function(element) {
                element.setAttribute('data-inc-map', this.getValue());
              }
            },
            {
              type: 'checkbox',
              id: 'inc-add',
              label: 'Include address?',
              setup: function(element) {
                this.setValue(element.getAttribute('data-inc-add') == 'true');
              },
              commit: function(element) {
                element.setAttribute('data-inc-add', this.getValue());
              }
            },
            {
              type: 'checkbox',
              id: 'inc-title',
              label: 'Include title?',
              setup: function(element) {
                this.setValue(element.getAttribute('data-inc-title') == 'true');
              },
              commit: function(element) {
                element.setAttribute('data-inc-title', this.getValue());
              }
            },
            {
              type: 'checkbox',
              id: 'inc-home',
              label: 'Include homepage?',
              setup: function(element) {
                this.setValue(element.getAttribute('data-inc-home') == 'true');
              },
              commit: function(element) {
                element.setAttribute('data-inc-home', this.getValue());
              }
            },
            {
              type: 'text',
              id: 'height',
              label: 'Map Height',
              setup: function(element) {
                this.setValue(element.getAttribute('data-height'));
              },
              commit: function(element) {
                element.setAttribute('data-height', this.getValue());
              }
            },
            {
              type: 'text',
              id: 'height',
              label: 'Map Width',
              setup: function(element) {
                this.setValue(element.getAttribute('data-height'));
              },
              commit: function(element) {
                element.setAttribute('data-height', this.getValue());
              }
            },
				  ]
			  },
		  ],
      
      onLoad: function() {
        // bind autocomplete functionality to text input
        $("#oxpointurifield").oxPointsAutoComplete({
          select: function(event, ui) {
            var oxpoint = $('.oxpoint');
            if (ui.item.uri) {
              oxpoint.attr('data-uri', ui.item.uri);
            }
          }
        });
      },

		  onShow: function() {
			  var selection = editor.getSelection();
        var element = selection.getStartElement();
        if ( element )
				  element = element.getAscendant( 'div', true );

			  if ( !element || element.getName() != 'div' || !element.hasClass('oxpoint')) {
				  element = editor.document.createElement( 'div' );
				  element.addClass('oxpoint');

				  this.insertMode = true;
			  }
			  else
				  this.insertMode = false;

			  this.element = element;

			  if ( !this.insertMode )
				  this.setupContent( this.element );
		  },

		  onOk: function() {
        var dialog = this;
			  var oxpoint = this.element;

			  this.commitContent( oxpoint );

			  if ( this.insertMode )
				  editor.insertElement( oxpoint );
		  }
	  };
  });
})();
