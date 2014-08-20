// apply youtube search functionality to an element of the dom

(function($){ $.fn.ytsearch = new YoutubeSearch; }(jQuery));

// YoutubeSearch class
var YoutubeSearch = function(options) {
  // PROPERTIES
  
  var settings = $.extend(
    // default settings
    classes: {},
    params: {},
    noResults: '<p>Sorry, no results!</p>'
  }, options);

  var query = {
    orderby: settings.params.orderby,
    maxresults: settings.params.maxResults,
  };
  
  // METHODS
    
  // behaviour for changing query parameters
  $.each(params, function(param, val) {
    this.find(settings.classes.param).change(function(){
      settings.params.param = $(this).val();
      search();
    });
  });
  
  // enable search button and give it the search functionality
  $(settings.classes.button).attr('disabled', false);
  $(settings.classes.button).click(function () {
    search(); return false;
  });
  
  // method that performs the youtube search
  var search = function() {
    // pull and sanitize the term
    var term = $(settings.classes.query).val().trim();
    
    // get base Youtube API URL and build up the string
    var url = 'https://www.googleapis.com/youtube/v3/search?key=' + settings.apiKey + ' &part=snippet'
    
    // build the string using the query property defined at the start
    query.forEach(function(key, value) {
      url = url + '&' + key + '=' + value;
    });
    
    // now perform the JSON call to get the results
    $.getJSON(url, function(results) {
      if (results.items) {
        // if we have items, loop through and display them
        // build up an html string and use that to fill the results box
        var html = "";
        
        results.items.forEach(function(item){
          html += '<p><a href="http://youtu.be/' + item.id.videoId + '"></p>';
        }); // end foreach
        
        $(settings.classes.results).html(html);
      }
      else {
        // no items
        $(settings.classes.results).html(settings.params.noResults);
      }
    });
  }

  return this;
}
