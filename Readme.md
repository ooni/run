## Setup

Dependencies:

* A recent version of [nodejs](https://nodejs.org/en/download/)

* [yarn](https://yarnpkg.com/en/docs/install)


Then run:

```
yarn install
```

## Commands

Start the development environment:

```
yarn run dev
```

Create a build:

```
yarn run build
```

This actually is running:

```
yarn run build:next && yarn run build:widgets
```

Upload a release:

```
yarn run release
```

Generate a OONI Run link:

```
yarn run genurl -- path/to/list.csv
```
