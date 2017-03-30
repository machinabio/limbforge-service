**fusion-microservice-worker**
----

This worker produces STLs generated from parametric CAD designs stored in Fusion360. Results are cached in S3 and future requests for the same parameters are served from the cache.

This is the backend for the (Limbforge)[https://github.com/limbforge/Limbforge] web app.  Although this is basically a single-purpose sever, the underlying architecture can be extended to automate CAD-tasks in general.

**Current Status**

* [] Call /api/rex from preview.js for each operation (`process_operation()` in /server/preview.js)
* [] Return the combined streams in the response.
* [] make a `print` endpoint (copy + modify preview.js)


**Installation**
----

1. Install Meteor
2. Install Git
3. Install Fusion360
3. `meteor npm install --global --production windows-build-tools` This takes ~5 minutes.

**API**
----
The API has two endpoints, `/preview` and `/print`, that both return STls. Both endpoints return either a single text-encoded STL or a ZIP-encoded archive containing multiple STL files.

### /preview
This endpoint returns the specified STL(s) in a low-resolution mesh suitable for on-screen preview.

* **Method:**
  
  `GET`
  
* **Query Params**

   The component and parameters are specified in the query string.

   **Required:**

   `component=[stringifed JSON]` <br />
   The component data is specified as a JSON object. The only required property is `id`, a GUID specifying a workflow that generates the desired component. Any additional properties included on the object are passed in as arguments to the workflow. Units can be specified (i.e. `3 mm`)
   in any standard units. If no units are specified, millimeters (mm) are the assumed unit.<br />
   *Multiple components are specified by including this parameter multiple times, ie. `/preview?component={"id":"foo","handedness":"L","param1":"2"}&component={"id":"bar","handedness":"L","paramX":"Y"}`*

* **Request Headers**

  A valid request must include an authorization header.
  
  * **Header:** `Authorization` <br />
    **Content:** String equal to "Bearer <SECRET>", ie. `Authorization=Bearer FAB395DEB7E0..."`

* **Success Response:**
  
  When a valid request is made, the server immediately responds with a header `Response_Delay` equal to the anticpated delay, in milliseconds, before fulfilling the request.

  * **Code:** `200 OK`<br />
    **Content:** text-encoded STL file. The header `Content-Type` is set to `application/vnd.ms-pkistl` or `application/zip` respectively if a single component or multiple components were requested.
 
* **Error Response:**

  An HTTP error code is used when the request cannot be fulfilled

  * **Code:** `503 SERVICE UNAVAILABLE` <br />
    **Reason:** The service has no available CAD agents to fufill the request.

  * **Code:** `400 BAD REQUEST` <br />
    **Reason:** There was a problem parsing the query parameters.

  * **Code:** `404 NOT FOUND` <br />
  **Reason:** The service has no available CAD agents to fufill the request.

* **Sample Call:**

  <_TODO_> 
  
  * **URL**

### /print
This endpoint returns the specified component(s) in resoltion suitable for printing. Otherwise, this endpoint is identical to the `/preview` endpoint.


# Deploy command

`DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy fusion360.io`

# Credits

* Punched Card by Ralf Schmitzer from the Noun Project
* Robot by Oksana Latysheva from the Noun Project
* analysis by Gregor Cresnar from the Noun Project
