[![Build Status](https://travis-ci.org/EMacco/Politico.svg?branch=develop)](https://travis-ci.org/EMacco/Politico) [![Coverage Status](https://coveralls.io/repos/github/EMacco/Politico/badge.svg?branch=develop)](https://coveralls.io/github/EMacco/Politico?branch=develop)

# Politico

Politico is an online platform where citizens can hold elections. Every user has the capability of running for a particular office simply by expressing interest to run, and on the election date every one will simply cast their votes from the conform of their homes.

# New Features!

  - Full access to a list of all electoral candidates
  - List of political offices available for contest
  - View all political parties around the country
  - View election results

You can also:
  - Express interest to run for an office
  - Vote for contestants

We are in the 21st century and it is only logically for us to follow the latest trent of technology. No more standing in queues, while putting your safety at risk of thugs.

### Tech

Politico uses a number of open source dependencies to work properly:
* [Express] - a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [Body-parser] - This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
* [Joi] - uses schemas to define validation rules and constraints for data.
* [node.js] - evented I/O for the backend

### Installation

Politico requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd politico
$ npm install -d
$ node app
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:3000
```


### Todos

 - Write MORE Tests
 - Integrate Petition

License
----

Emmanuel Okwara

