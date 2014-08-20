// apply youtube search functionality to an element of the dom
// <!-- Written by Amit Agarwal --> completely re-editted by lawrence
(function($){
  $.fn.ytsearch = function(options) {
    // PROPERTIES
    var settings = $.extend({
      // default settings
      classes: {},
      params: {
        order: 'relevance',
        maxResults: '5',
      },
      noResults: '<p>Sorry, no results!</p>',
      displayResult: function (item) {
        return '<p><a href="http://youtu.be/' + item.id.videoId + '">' + item.snippet.title + '</p>';
      },
    }, options);

    // initialize the query
    var query = settings.params;
    
    // take values from existing fields
    $.each(settings.params, function(param, value) {
      var setting = $(settings.classes[param]).val()
      if (setting) query[param] = setting;
    });
    
    // METHODS
      
    // behaviour for changing query parameters
    $.each(settings.params, function(param, value) {
      $(settings.classes[param]).change(function(){
        query[param] = $(this).val();
        search();
      });
    });
    
    // enable search functionality
    /*this.submit(function () {
      search(); return false;
    });
    */
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
      $.each(query, function(key, value) {
        url = url + '&' + key + '=' + value;
      });
      
      url = url + '&q=' + term;
      
      // now perform the JSON call to get the results
      $.getJSON(url, function(results) {
        if (results.items) {
          // if we have items, loop through and display them
          // build up an html string and use that to fill the results box
          var html = "";
          
          results.items.forEach(function(item){
            html += settings.displayResult(item);
            //html += '<p><a href="http://youtu.be/' + item.id.videoId + '"></p>';
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
  };
} (jQuery));
