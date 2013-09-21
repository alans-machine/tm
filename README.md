TM
==

A turing machine running in your browser

bower
-----

We use [bower][] to package our dependencies.

```sh
npm install -g bower
```

Run the following commands to install the depencies

```sh
bower install
```

package
-------

We use [grunt][] to automate checking, concatenating, minifying and
packaging the code. It depends on a globally installed `grunt-cli`

```sh
npm install -g grunt-cli
```

afterwards install all the development dependencies

```sh
npm install
```

The following command checks, concatenates and minifies the code in
the lib directory.

```sh
grunt
```

When you want to package the distribution run

```sh
grunt compress
```

[bower]: http://bower.io/
[grunt]: http://gruntjs.com/