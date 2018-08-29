# Sirius Explorer

A Sirius blockchain explorer web application service for [Siriuscore Node](https://github.com/siriuscore/siriuscore-node) using the [Sirius API](https://github.com/siriuscore/sirius-insight-api).

## Getting Started

1. Install nvm https://github.com/creationix/nvm  

    ```bash
    nvm i v8
    nvm use v8
    ```

2. Install mongo https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/  

Then open a Mongodb client window and create a user and database:

```
use sirius-api-livenet
db.createUser(
   {
     user: "sirius",
     pwd: "mynewpassword",
     roles: [ "readWrite", "dbAdmin" ]
   }
)
```

3. Install the sirius core wallet https://github.com/siriuscore/sirius

    ```bash
    # with ZMQ
    sudo apt-get install libzmq3-dev
    ```

4. Install siriuscore-node

    ```bash
    npm i siriuscore-node

    $(npm bin)/siriuscore-node create mynode

    cd mynode

    $(npm bin)/siriuscore-node install https://github.com/siriuscore/sirius-insight-api.git#master
    $(npm bin)/siriuscore-node install https://github.com/siriuscore/sirius-explorer.git#master
    ```

5. Edit siriuscore-node.json

```json
  {
    "network": "livenet",
    "port": 3001,
    "services": [
      "siriusd",
      "web",
      "sirius-insight-api",
      "sirius-explorer"
    ],
    "servicesConfig": {
      "sirius-explorer": {
        "apiPrefix": "sirius-insight-api",
        "routePrefix": "sirius-explorer",
        "nodemapLink": "https://sirius.org/en/nodemap"
    },
      "sirius-insight-api": {
        "routePrefix": "sirius-insight-api",
        "db": {
          "user": "sirius",
          "password": "mynewpassword",
          "host": "localhost",
          "port": 27017,
          "database": "sirius-api-livenet"
        },
        "erc20": {
          "updateFromBlockHeight": 10000
        }
      },
      "siriusd": {
        "spawn": {
          "datadir": "/home/user/.sirius",
          "exec": "/home/user/sirius/src/siriusd"
        }
      }
    }
  }
```  

6. Edit sirius.conf and make sure siriusd runs correctly. You need to run siriusd at least once with `reindex=1` enabled. Once the chain is synced you can kill siriusd and comment the `#reindex=1` setting like below.

    ```bash
    server=1
    whitelist=127.0.0.1
    logevents=1
    txindex=1
    addressindex=1
    timestampindex=1
    spentindex=1
    par=2
    onlynet=ipv4
    maxconnections=24
    zmqpubrawtx=tcp://127.0.0.1:28332
    zmqpubhashblock=tcp://127.0.0.1:28332
    rpcallowip=127.0.0.1
    rpcuser=user
    rpcpassword=password
    rpcport=8332
    addrindex=1
    #reindex=1
    ```  

7. Run Node:

    ```bash
    $(npm bin)/siriuscore-node start
    ```  

8. Open a web browser to `http://localhost:3001/sirius-explorer` or `http://localhost:3001/sirius-insight-api`  

## Development

To run Insight UI locally in development mode:

Install dependencies:

```bash
npm install
```

To compile and minify the web application's assets:

```bash
grunt compile
```

There is a convenient Gruntfile.js for automation during editing the code

```bash
grunt
```

## Multilanguage support

Insight UI uses [angular-gettext](http://angular-gettext.rocketeer.be) for multilanguage support.

To enable a text to be translated, add the ***translate*** directive to html tags. See more details [here](http://angular-gettext.rocketeer.be/dev-guide/annotate/). Then, run:

```bash
grunt compile
```

This action will create a template.pot file in ***po/*** folder. You can open it with some PO editor ([Poedit](http://poedit.net)). Read this [guide](http://angular-gettext.rocketeer.be/dev-guide/translate/) to learn how to edit/update/import PO files from a generated POT file. PO file will be generated inside po/ folder.

If you make new changes, simply run **grunt compile** again to generate a new .pot template and the angular javascript ***js/translations.js***. Then (if use Poedit), open .po file and choose ***update from POT File*** from **Catalog** menu.

Finally changes your default language from ***public/src/js/config***

```javascript
gettextCatalog.currentLanguage = 'es';
```

This line will take a look at any *.po files inside ***po/*** folder, e.g.
**po/es.po**, **po/nl.po**. After any change do not forget to run ***grunt
compile***.

## Note

For more details about the [Sirius API](https://github.com/siriuscore/sirius-insight-api) configuration and end-points, go to [Sirius API](https://github.com/siriuscore/sirius-insight-api).
