### This repository is created as a MVP for a whatsapp bot.

# ts-node Project setup.

## Prerequisites

You will need to install typescript and ts-node to run this project. You will then need to install the required packages. Follow the commands below to setup your environment.

-   Node version v16.15.1

```
$ npm install --location=global typescript
$ npm install --location=global ts-node
$ npm install
```

<p>To run the script, run the command below.<p>

```
$ npm run start
```

---

# Run different releases by checking out git tags.

```
$ git pull
$ git checkout tags/v1.0.0
$ npm run prod
```

# Saving different releases

```
$ git tag -a v1.0.0 -m "Release version 1.0.0"
$ git push origin v1.0.0
```

## Running files:

-   Use `ts-node` to run individual files.
-   For example

```
$ ts-node app/src/index.ts
```

Running all test tests:

```
$ npm test
```

---

More scripts have been defined in the package.json
