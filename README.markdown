# Summon 2.0 Customizations

These files are the JavaScript, CSS, and PHP scripts that modify the stock Summon 2.0 discovery interface for our patrons. Some of the configurations are custom to GVSU's instance, like correcting old defunct library names on holding records.

The JavaScript (summon2.js) is loaded by the tool, and it adds the custom CSS file (summon2.css) to the document &lt;head&gt;. 

It includes an HTTP request (added iframe) to record eBook referrals, so we can better understand where our patrons find and access eBooks.

It also includes an AJAX call to save the search query to a MySQL database through the summon2.php script. This script corrects for artifically inflated search statistics by ProQuest, since they count every facet click as a new search rather than as a refinement. It also records the search queries so we have access to them outside of the Summon client center. Details on how the searches are calculated are in the comments of the summon2.php file.


#### Questions?

Ask Matthew Reidsma, Web Services Librarian at [reidsmam@gvsu.edu](mailto:reidsmam@gvsu.edu) or [@mreidsma](http://twitter.com/mreidsma).
