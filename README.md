# TasteBuds
React App for Tastebuds. Using Redux.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

As well as with: https://medium.com/@notrab/getting-started-with-create-react-app-redux-react-router-redux-thunk-d6a19259f71f

Please note, Node and NPM must be installed.

## Installing Node with Homebrew

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## Ensure you have the latest Homebrew

```
$ brew update
```

## Make sure your system is ready to brew

```
$ brew doctor
```

You must set  Homebrew's location to your `$PATH` in your `.bash_profile` or `.zshrc` file respectively.

```
$ export PATH="/usr/local/bin:$PATH"
```

## Install Node

```
$ brew install node
```

In some rare cases, you have to explicitly configure NPM after exporting a `$PATH`.

```
$ npm config get prefix
```

Then:

```
$ npm config set prefix /usr/local
```

Once that is complete you're ready to begin installing the app locally.  Clone the SSH version of the repo to your desired directory then follow these instructions.

## Install Packages and Dependencies

```
$ npm install
```

## Start the Development Server

```
$ npm start
```

## Compile a Distribution Build

```
$ npm run build
```
