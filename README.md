**Limbforge-service**
----

This worker produces STLs generated from parametric CAD designs stored in Fusion360. Results are cached in S3 and future requests for the same parameters are served from the cache.

This is the backend for the (Limbforge)[https://github.com/limbforge/Limbforge] web app.  Although this is basically a single-purpose sever, the underlying architecture can be extended to automate CAD-tasks in general.

**Installation**
1. Install Meteor
2. Clone the git repo
3. Copy the `settings.sample.json` as `settings.json` and update contents accordingly.
3. `meteor npm install`
4. `meteor run --settings settings.json`

**Directory Structure**

/client : All of these files are loaded on a desktop or embedded Fusion360 browser.

/server : These files are loaded on the server.

/public : Images and other static content

/imports/api             - Shared code.

/imports/api/fusion360js - Copy of the Fusion360 javascript libraries.

/imports/api/shift       - Shift javascript extensions.

/imports/collections     - Data models for important classes.

/imports/publications    - Data publications.

/imports/routes          - Both client- and server-side routes.

/imports/ui/browser      - Templates for the browser interface.

/imports/ui/fusion360    - Templates for the embdedded Fusion360 plugin. Only displayed in the Elements panel of the Chrome debugher console.

/imports/ui/palette      - Templates presented in a Fusion360 Palette.


**Credits**

* Punched Card by Ralf Schmitzer from the Noun Project
* Robot by Oksana Latysheva from the Noun Project
* analysis by Gregor Cresnar from the Noun Project
