# Summon 2.0 Customizations

These files are the JavaScript, CSS, and PHP scripts that modify the stock Summon 2.0 discovery interface for our patrons. The JavaScript (summon2.js) is loaded by the tool, and it adds the custom CSS file (summon2.css) to the document &lt;head&gt;. The PHP file acts like a clunky webservice on top of our Sierra-driven OPAC to pass the appropriate request links back to the discovery service. Since we have three ASRS (Advanced Storage and Retrieval Systems) we sometimes need a special URL that will move the crane directly rather than print a paging slip. This workaround attempts to make the book requesting process a bit more seamless for the patron.

#### Questions?

Ask Joel Richard, Head of Web Services at [richardjm@si.edu](mailto:richardjm@si.edu).

#### Credit

This was forked from Grand Valley State University's [GitHub repo of the same name](https://github.com/gvsulib/Summon-2.0-Scripts)
