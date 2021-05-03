# This is the Code for the Website of ITP Thesis Archive 2020.

It is built in React and Typescript, using create react app.

## To Develop Locally

In the project directory, to install all dependencies, run:

    yarn

To start the application, run:

    yarn start

This runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## To change where the api pulls the data from

The front-end pulls the data from the wordpress api served
from the thesis archiver wordpress site.

To change the url where this pulls from:

Open [src/util/api.ts](src/util/api.ts) and edit the `baseApiUrl` variable.

## To deploy a preview

The site can be easily deployed to Netlify to be previewed.

Follow the [create react app guide on deploying to netlify](https://create-react-app.dev/docs/deployment/#netlify)

With continuous delivery, every time the code is pushed to master, netlify will pick up these code changes and deploy.

It is recommended to deploy this way continuously until the design/development is finalized, in which case you will want to build the javascript locally and hand over the folder to the Thesis Archive Wordpress admins - instructions below.

## To Build a Package that can be Deployed to a Site

In the project directory:

    yarn build

This will create the built package in 'build'

You can zip this folder and upload it to the server and this will serve as the front-end.

To test it on a local server:

    yarn global add serve
    serve -s build

