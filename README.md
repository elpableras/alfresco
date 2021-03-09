# Alfresco Content Services Community Packaging

Evaluation of the option of Alfresco as ECM.

This project is producing packaging for [Alfresco Content Services Repository](https://community.alfresco.com/docs/DOC-6385-project-overview-repository).

## Docker Alfresco
On official releases, the image is published: [https://hub.docker.com/r/alfresco/alfresco-content-repository-community/tags/](https://hub.docker.com/r/alfresco/alfresco-content-repository-community/tags/)

## Deploying using Docker Compose

Use this information to quickly start up Alfresco Community Edition using Docker Compose. This deployment method is only supported for development and test environments.

### Requirements

*  Docker
    * Although 16 GB is the required minimum memory setting, keep in mind that 6 GB is much lower than the required minimum
*  Docker-compose

### Steps

To deploy Alfresco Community Edition using docker-compose, download and install [Docker](https://docs.docker.com/install/), then follow the steps below.

1.  Clone the project locally, change directory to the project folder, and switch to the release branch:

> `git clone https://gitlab.cern.ch/webservices/alfresco.git` 

2.  Change directory to the docker-compose folder:

> `cd docker-compose` 

3.  Deploy Alfresco Community Edition, including the repository, Share, Postgres database, Search Services, etc.:

> `docker-compose up`

Downloads the images, fetches all the dependencies, creates each container, and then starts the system:

```
...
Creating docker-compose_activemq_1 ... done
Creating docker-compose_postgres_1 ... done
Creating docker-compose_solr6_1    ... done
Creating docker-compose_share_1    ... done
Creating docker-compose_alfresco_1 ... done
Attaching to docker-compose_postgres_1, docker-compose_share_1, docker-compose_alfresco_1, docker-compose_activemq_1, ...
...
```

If you downloaded the project and changes were made to the project settings, any new images will be pulled from GitHub before the system starts.

As an alternative, you can also start the containers in the background by running ***docker-compose up -d***.

4.  Wait for the logs to complete, showing message:

```
...
alfresco_1 | 2019-02-21 11:50:50,388  INFO ... Starting 'Transformers' subsystem, ID: [Transformers, default]
alfresco_1 | 2019-02-21 11:50.50,782  INFO ... Startup of 'Transformers' subsystem, ID: [Transformers, default] complete
...
```

Stop the session (by using CONTROL+C).

Remove the containers (using the --rmi all option):

> `docker-compose down --rmi all` 

5.  Open your browser and check everything starts up correctly:

*  Administration and REST APIs: http://*LOCALHOST*:8082/alfresco or https://*LOCALHOST*/alfresco
*  Share: http://*LOCALHOST*:8080/share or https://*LOCALHOST*/share
*  Search administration: http://*LOCALHOST*:8083/solr or https://*LOCALHOST*/solr

6.  Log in as the *admin* user. Enter the default administrator password *admin*.


## Configuration Database

### PostgreSQL

On [DB On Demand](https://resources.web.cern.ch/resources/Manage/DbOnDemand/Resources.aspx) you can ask for a DB for your apps.

[Administration Panel](https://dbod.web.cern.ch)

### Database clients
You can connect to the database using any of the available tools for this task, like the PostgreSQL command line client psql.

From now on, any further reference will take for granted the use of the CLI psql tool.

### Connecting to the database
To connect to your database, as administrator, using the CLI tool, type the following:

> `psql -h <ip-alias> -p <port> -U admin` 

We will provide you with this information, along with your password, when your instance is created.

### Set/change password
To set or change a password, run this statement in psql:

> `ALTER ROLE user_name WITH PASSWORD 'new_password';` 

Create the database and a normal user:

> `CREATE ROLE alfresco WITH LOGIN PASSWORD 'alfresco';`
> 
> `CREATE DATABASE alfresco;`
> 
> `GRANT ALL PRIVILEGES ON DATABASE alfresco TO alfresco;`

## Alfresco Identity Service EA (Keycloak)

### Configure Alfresco Content Services (ACS)

Now, we need to [configure](https://docs.alfresco.com/6.1/concepts/is-config.html) ACS to use the [Alfresco Identity Service](https://docs.alfresco.com/6.1/concepts/is-properties.html) (i.e. keycloak). For this you have to insert the variables to enabled the identity service in the docker-compose, in the service of Alfresco in JAVA_OPTS:

> ```
> -Dauthentication.chain=identity-service1:identity-service,alfrescoNtlm1:alfrescoNtlm
> -Didentity-service.authentication.enabled=true
> -Didentity-service.enable-basic-auth=false
> -Didentity-service.authentication.allowGuestLogin=false
> -Didentity-service.authentication.validation.failure.silent=false
> -Didentity-service.auth-server-url=https://keycloak.cern.ch/auth
> -Didentity-service.ssl-required=external
> -Didentity-service.realm=master
> -Didentity-service.resource="YOUR_CLIENTID"
> ```

Everything is working fine, time to move on to the ADF applications and configure them to integrate with keycloak.

### Configure ADF Applications

#### Prerequisites

Node.js and NPM, if you don't have these, then head over to the Node.js site and install. Node and npm are used to run ADF apps, which are Angular based.

The version of the node in the CERN is the 6.something, you will have an error with this version because the native [AsyncFunction](https://github.com/terkelg/prompts/issues/32) was introduced in version 7.6.

So, you need to download another version, [Latest Nodejs on CentOS/RHEL 7/6](https://tecadmin.net/install-latest-nodejs-and-npm-on-centos/)

For Latest Release:-

> `curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -`

For Stable Release:-

> `curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -`


And now you can install the new version:

> `sudo yum install -y nodejs` 

Check Node.js and NPM Version

> `node -v  && npm -v` 


#### Installing Yeoman and the App Generator
The official guide is this: [ADF application generator for Yeoman](https://github.com/Alfresco/generator-ng2-alfresco-app)

Steps: Installing Yeoman and the App Generator

First, install [Yeoman](https://yeoman.io/codelab/setup.html):

> ` npm install --global yo `

* If you have some problem with permission or access errors such as EPERM or EACCESS, do not use sudo as a work-around. You can consult this [guide](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md) for a more robust solution.

* If you have a [stunk](https://stackoverflow.com/questions/20047008/npm-does-not-install-anything-it-hangs) problem during the installation, in my case as I installed a plenty of times the npm and the node in the default folder and others folder, I had a stunk when I tried to install again, when I have fixed the problems, so the solution for this is cleaned .npm and node_modesl/.staging directories, and problem just gone!

(replace the paths with your own)

> ```
> yes|rm .npm/* -R
> yes|rm /path/to/node_modules/.staging/* -R
> npm install --global yo
> ```

Checked the application:

> ` yo --version `


When you have Yeoman, you need to install the Alfresco Application Generator:

> `npm install -g generator-alfresco-adf-app `


#### Generating a new application project

Move in the folder where you want to create your project.

> `yo alfresco-adf-app` 

![adf-app-client](../img/adf-app-client.PNG)

The ACS URL need to be configured in the newly generated ADF app as the default ones don’t match. Open up the proxy.conf.json file and change it to the following:


> ```
> module.exports = {
>     "/alfresco": {
>         "target": "YOUR_URL",
>         "secure": true,
>         "changeOrigin": true
>     }
> };
> ```

We also need to do some configuration to enable Identity Service authentication (Keycloak), open up the src/app.config.json file and configure OAuth2 as follows:

> ```
>  "$schema": "../node_modules/@alfresco/adf-core/app.config.schema.json",
>  "ecmHost": "https://{hostname}{:port}",
>  "bpmHost": "https://{hostname}{:port}",
>  "providers" : "ECM",
>  "authType" :"OAUTH",
>  "oauth2": {
>  "host": "https://auth.cern.ch/auth/realms/cern",
>  "clientId": "YOUR_CLIENTID",
>  "scope": "openid",
>  "secret": "YOUR_TOKEN",
>  "implicitFlow": true,
>  "silentLogin": true,
>  "redirectUri": "/",
>  "redirectUriLogout": "/logout"
>   },
>     "application": {
>         "name": "Alfresco ADF Application"
> ```

The next step is install all packages and then start the ADF App as follows:

> ```
>  cd adf-app-client/
> 
>  npm install
> ```

Possibles problems:
If when you run the commands, appear a similar message to this:

`npm WARN tar Unknown system error -122: Unknown system error -122, open`

The problem is that you don't have space in your disk.

#### [Configuring Angular CLI to use https](https://angular.io/cli/serve)

Certificates for the host: [https://ca.cern.ch/ca/host/HostCertificates.aspx](https://ca.cern.ch/ca/host/HostCertificates.aspx)
Certificates for CA: [https://cafiles.cern.ch/cafiles/certificates/](https://cafiles.cern.ch/cafiles/certificates/)

Now that we have the certificate files, it is simple to configure Angular CLI to use these to serve over https. I place the key and crt files in a separate folder. I update my package.json file as follows:
"start": "npm run validate-config && ng serve --ssl true --ssl-key ../https/certs/server.key --ssl-cert ../https/certs/server.crt --host alfresco-test.cern.ch"


And the last but not less important

> ```
>  npm start
> ```

And then access the UI on URL http://YOUR_LOCALHOST:4200. It should redirect you to Keycloak for authentication with after this you should watch your Alfresco Page, something like this:

![alfresco](../img/Alfresco_after_keycloak.PNG)

Possibles problems:

> `Data path ".builders['app-shell']" should have required property 'class'.` 

[Solution](https://stackoverflow.com/questions/56393158/errors-data-path-buildersapp-shell-should-have-required-property-class):

>```
> npm uninstall @angular-devkit/build-angular
>
> npm install @angular-devkit/build-angular@0.13.0
>```