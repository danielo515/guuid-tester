# GUUID uniquenes tester
This is a very small and stupid utility to check if an algorithm is able to
generate GUUIDs (	Globally Universally Unique Identifier ).

It relies on mongodb unique indexes to check collisions.
It will create the required index. It will fail if does not have the required permissions.
For small test we recommend you to use a local unprotected mongodb docker image.

#Installation
The installation is easy, just cd to the app folder and run:

```sh
git clone git@github.com:danielo515/guuid-tester.git
cd guuid-tester
npm install
```

#Requirements
If you want to use the provided shortcut of a local DB contained in a docker image you will need

- docker
- docker-compose

In any case you will need
- nodejs >= 4.3.2
- npm

# Usage
For the shake of simplicity we include a `docker-compose` file, so the easiest way to use it is

```sh
cd guuid-tester #make sure you are on the app folder
docker-compose up && node src/index.js
```

We include some example algorithms, one that fulfills the GUUID
requirments and other that does not:
- nodeuuid.js uses node-uuid library and fulfills the requirments
- cryptojs.js uses CryptoJS library and does not fulfills the requirments

# Testing an algorithm
Testing an algorithm is easy:

1. Create a new file that exports an object
1. The exported object should fulfill the following interface

   ```js
   {
       name: 'name-of-the-algorithm-or-used-library',
       /* @function generateUUID
          Synchornous function that generates and returns one ID.
          @returns string
       */
       generateUUID: () => myLib.uuid();
    }
   ```
1. Then edit `index.js` and require your file in the following line:

    ```js
    const testingLibrary = require('./your_file.js');
    ```
