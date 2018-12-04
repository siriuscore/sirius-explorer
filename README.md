# Sirius Explorer

A Sirius blockchain explorer web application service for [Siriuscore Node](https://github.com/siriuscore/siriuscore-node) using the [Sirius API](https://github.com/siriuscore/sirius-insight-api).

## Getting Started

1. Install nvm https://github.com/creationix/nvm  
    We need Node 8. Nvm is a nice utility that allows easy switching between node versions.

    ```bash
    nvm i v8
    nvm use v8
    ```

2. Install mongo https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/  

    Then open a Mongodb client window and create a user and database:

    ```bash
    use sirius-api-livenet
    db.createUser(
      {
        user: "sirius",
        pwd: "mynewpassword",
        roles: [ "readWrite", "dbAdmin" ]
      }
    )
    ```

3. Sirius wallet installation

    Compile the addressindex branch and make sure you have ZMQ installed

    ```bash
    # Dependencies
    sudo apt-get install build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils git cmake libboost-all-dev
    sudo apt-get install software-properties-common
    sudo add-apt-repository ppa:bitcoin/bitcoin
    sudo apt-get update
    sudo apt-get install libdb4.8-dev libdb4.8++-dev
    # with ZMQ
    sudo apt-get install libzmq3-dev

    # If you want to build the Qt GUI:
    sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler qrencode

    # Get the Sirius wallet
    git clone https://github.com/siriuscore/sirius
    cd sirius
    git fetch origin
    git checkout addressindex

    # Note autogen will prompt to install some more dependencies if needed
    ./autogen.sh
    ./configure
    make -j2

    ```

4. Install siriuscore-node

    ```bash
    mkdir siriusnode
    cd siriusnode

    npm i siriuscore-node

    ./node_modules/.bin/siriuscore-node create mynode
    cd mynode

    ../node_modules/.bin/siriuscore-node install https://github.com/siriuscore/sirius-insight-api.git#master
    ../node_modules/.bin/siriuscore-node install https://github.com/siriuscore/sirius-explorer.git#master
    ```

5. Edit siriuscore-node.json to be similar to this (replace user with your username):

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
              "updateFromBlockHeight": 5000
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

6. Configure Sirius and sync the blockchain

    ```bash
    cd ~
    mkdir .sirius
    cd .sirius
    touch sirius.conf
    ```

    Edit sirius.conf:

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
    reindex=1
    ```

    Run siriusd and sync the chain:
    ```bash
    cd ~/sirius/src
    ./siriusd &
    ```
    You can check the progress of the sync with the `sirius-cli` command. Kill the daemon once the chain is synchronized.
    ```bash
    ./sirius-cli getInfo

    pkill siriusd
    ```
    You only need to run siriusd once with `reindex=1` enabled. Once the chain is synced you can kill siriusd and comment the reindex setting in ~/.sirius/sirius.conf `#reindex=1`

7. Run Node (from the mynode folder):

    ```bash
    ../node_modules/.bin/siriuscore-node start
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

## Multi language support

Insight UI uses [angular-gettext](http://angular-gettext.rocketeer.be) for multi language support.

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
