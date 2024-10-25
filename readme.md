## App Initialization
Before starting anything, make sure to add all 4 .env files to the root of the project.

## Running tests and development

**The project contains 3 databases:**

- for development (emobility-dev)
- for running tests (emobility-test)
- for production and manual testing e.g. with postman (emobility)

**To start development and testing:**
- spin up the databases with: npm run docker-compose:db
  It will start the databases and run all necessary migrations. It may take a while during first run.
- Install all necessary dependencies. Run - *npm install*
  (If you don't have node installed on your computer, you can still test the app. Scroll to "Production and manual testing" to learn more)

-  start development server, run *npm run dev*

- To start tests, run *npm run test*
  All unit tests mock all external functions, db etc.
  All unit tests save and get data from real db for maximum certainty.

## App flow

In order to create a charging station with specified type and connectors, read the limitation details:

- You can't add a type to charging station before adding proper amount of connectors. (e.g. if charging station type plug_count = 2, You have to first add 2 connectors to charging station before adding the type to the charging station. It means that you can't create a charging station with specified type. You can only update it later.

**suggested app flow:**

- sign in
- create a charging station
- create connectors with chargingStationId specified.
- find or create a charging station type with plug_count equals to the amount of connectors connected to the charging station
- update charging station - set "chargingStationTypeId" to the id of the created type

## Endpoints and body

All endpoints start with: **/api/v1** e.g. api/v1/connectors/:id

**Auth related endpoints. In gray box is structure of the body**

sign in
> POST /auth/sign-in


    {
    	"username": "admin123",
    	"password": "password"
    }

Refresh access token
> GET /auth/refresh

Logout
>GET /auth/logout

**All other endpoints have the same structure, they only differ with prefix (e.g. "/connectors", "/charging-stations" or "/charging-station-types"**)

The example below is made with "/charging-stations", but apply to all other routes.


- get one element
> GET /charging-stations:id

- get all elements
> GET /charging-stations

- filter elements
> GET /charging-stations?name=hyper-station&ipAddress=123.168.1.200

- pagination
> GET /charging-stations?limit=10&offset=2
- update (You can specify as many fields as you wish)
> PUT /charging-stations:id

    {
	    "name":"SuperCharge update",
	    "firmwareVersion": "v10.0.5"
    }
- delete  element
> DELETE /charging-stations:id

create element
> POST /charging-stations

    {
	    "name": "SuperCharge Station",
	    "deviceId": "3fa25f22-5717-4562-b3fc-2c963f66afa6",
	    "ipAddress": "123.168.1.200",
	    "firmwareVersion": "v1.0.5"
    }

## Production and manual testing
If you want to deploy the app to the server or just test it with postman, you can run
*npm run docker-compose*.
It will spin up both database and server in a docker container, so you don't need to have node on your computer nor postgres.

## Ports

- Databases run on port 5432
- Both development and production version runs on port 3000