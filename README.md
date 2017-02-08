# fusion-microservice-worker

## Installing on Windows Server

1. Install Meteor
2. Install Git
3. Install Fusion360
3. `meteor npm install --global --production windows-build-tools` This takes ~5 minutes.
4. 


## Format

The Fusion360 Worker accepts the following parameters in the URL

* filename = Name of the worker script
* id = UUID for callback URL. `localhost/api/incoming/:id`
* privateInfo = JSON of data that's available to the worker script. This information is saved in the temp directory in a file.

# Credits

Punched Card by Ralf Schmitzer from the Noun Project
Robot by Oksana Latysheva from the Noun Project
analysis by Gregor Cresnar from the Noun Project
