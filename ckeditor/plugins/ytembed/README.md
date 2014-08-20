HOW TO USE

1. Ensure that you have jQuery v1.11.1+ running on your pages.

2. Copy /ytembed folder to /plugins directory of CKEditor installation

3. Go to /ytembed/js/key.js. It contains a variable for setting the correct
   Google API key. Modify it to be your corresponding key.
   
4. On any page that loads the output content from the editor, ensure that the 
   ytembed/css/ytembed.css file is loaded, and that you have the following
   in your header:
   
     <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

   This loads icons that will be used in the dialog and editor area.

5. On the pages that display the YouTube videos, have the following script run:
    
     $('[data-youtube-embed]').ytembed();
    
   This replaces all div placeholders for the YouTube videos with the actual embed code.

6. In the script tags where you define your editor, have the following code below:

     editor.config.extraPlugins = 'ytembed';
		 editor.config.contentsCss = [CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ytembed/css/contents.css', 'http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css'];
	   CKEDITOR.scriptLoader.load(CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ytembed/js/key.js' );
	   CKEDITOR.scriptLoader.load(CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ytembed/js/ytsearch.js' );
	   CKEDITOR.scriptLoader.load(CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'ytembed/js/ytembed.js' );

   This loads the plugin into the editor, along with its required dependencies for the editor.
