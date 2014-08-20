/** 
  * Title:        YouTubeSearch (ytSearch)
  * Description:  Turn any form into a dynamic YouTube Search page
  * Author:       Lawrence Okoth-Odida
  * Notes:        This is for use with Version 3 of Youtube's Search API
                  Credit to Amit Agarwal for the only working code I could find
                  for using the v2 API to fetch search results
  * Version:      0.1
  * Date:         04/06/2014

  * BASIC USAGE
      1. Provide some markup for your search form and search results, e.g.
            <form id="searchform">
              <input id="query" type="text"><input id="submit" type="submit">
            </form>
            <div id="searchresults"></div>
            
     2. Call ytsearch on the form, declaring your API key in the parameters, e.g.
            $('#searchform').ytsearch({
              apiKey: 'YOUR-GOOGLE-API-KEY',
            });
            
     3. If the user writes a search query and hits the submit button, the #searchresults 
        div will be populated with the first 5 results from the query.

  * ADVANCED USAGE
      The ytsearch method takes an object literal as a parameter, and that literal
      defines the options. These options affect the functionality thus:
      
      @param apiKey {string} 
        Google API Key required to access Youtube's Search API.
        THIS IS A REQUIRED FIELD.
                        
      @param params {object} 
        Parameters for the search list in accordance with Youtube's v3 API Search List 
        documentation (https://developers.google.com/youtube/v3/docs/search/list)
        e.g.             
          params: {
            order: 'date',
            maxResults: 10
          }
                          
        ensures that the query is sorted by creation date and that (at most) 10 results 
        will be displayed.
                        
      @param classes {object} 
        Define the CSS classes or ids for inputs that will affect the search query. 
        For example, if you have an input field that lets the user change the maximum 
        number of results displayed (e.g. <input id="changemaxresults">), then 
                        
          classes: {
            maxResults: '#changemaxresults'
          }
                          
        will make it so that if that input is changed by the user, its value will be 
        used for the search query. Each class can be either a CSS selector or a 
        jQuery object (e.g. maxResults: $('#changemaxresults')).
                        
      @param noResults {string}
        HTML to show if there are no search results available
      
      @param displayResult {function}
        that takes an individual search result as a parameter and returns the HTML 
        string for displaying that result. Use this to provide custom displays for 
        your results. Consult with the documentation on Sample Requests
        (https://developers.google.com/youtube/v3/sample_requests) to see the JSON structure.
        e.g.
        
          displayResult: function (item) {
            return '<a href="http://youtu.be/' + item.id.videoId + '">' + item.snippet.title + '</a>';
          }
          
        Displays the title of the video and a URL link to it.
  */

(function($){
  $.fn.ytsearch = function(options) {
    // initialize the settings
    var settings = $.extend({
      classes: {
        query: '#query',
        button: '#button',
        results: '#searchresults',
      },
      params: {
        order: 'relevance',
        maxResults: '5',
      },
      noResults: '<p>Sorry, no results!</p>',
      displayResult: function (item) {
        return '<p><a href="http://youtu.be/' + item.id.videoId + '">' + item.snippet.title + '</p>';
      },
    }, options);

    // initialize the query (will be used to build the correct url string)
    var query = settings.params;
    
    // take values from existing fields (if the classes are defined)
    $.each(settings.params, function(param, value) {
      var setting = $(settings.classes[param]).val()
      if (setting) query[param] = setting;
    });
    
    // if any of the settings-based parameters change, stick that new value into the query
    $.each(settings.params, function(param, value) {
      var obj = (typeof settings.classes[param] == 'string') ? settings.classes[param] : $(settings.classes[param]);
      $(settings.classes[param]).change(function() {
        query[param] = $(this).val();
        search();
      });
    });
    
    // if the search button is clicked, run the search
    $(settings.classes.button).click(function () {
      search(); return false;
    });
    
    this.on('submit', function() {
      search();
      return false;
    });
    
    // method that performs the youtube search
    var search = function() {
      // pull and sanitize the search term
      var term = $(settings.classes.query).val().trim();

      // get base Youtube API URL and build up the string
      var url = 'https://www.googleapis.com/youtube/v3/search?key=' + settings.apiKey + ' &part=snippet';
      
      // build the string using the query property defined at the start
      $.each(query, function(key, value) {
        url = url + '&' + key + '=' + value;
      });
      
      // add the search query to the end
      url = url + '&q=' + term;
      
      // now perform the JSON call to get the results
      $.ajax({
        url: url,
        dataType: 'json',
        success: function(results) {
          if (results.items.length > 0) {
            // if we have items, loop through and display them
            // build up an html string and use that to fill the results box
            var html = "";
            
            results.items.forEach(function(item) {
              html += settings.displayResult(item);
            });
            
            $(settings.classes.results).html(html);
          }
          else { // no items
            $(settings.classes.results).html(settings.noResults);
          }
        },
        error: function () {
          // bad request (e.g wrong api key)
          $(settings.classes.results).html('<p class="badrequest">Bad request. Ensure that you have supplied a valid Google API Key to use this plugin.</p>');
        }
      });
    }

    return this;
  };
} (jQuery));
