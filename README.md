[![Build Status](https://travis-ci.org/mendixlabs/listview-filter.svg?branch=master)](https://travis-ci.org/mendixlabs/listview-filter)
[![Dependency Status](https://david-dm.org/mendixlabs/listview-filter.svg)](https://david-dm.org/mendixlabs/listview-filter)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/listview-filter.svg#info=devDependencies)](https://david-dm.org/mendixlabs/listview-filter#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/listview-filter/branch/master/graph/listview-filter.svg)](https://codecov.io/gh/mendixlabs/listview-filter)
![badge](https://img.shields.io/badge/mendix-7.6.0-green.svg)
# Listview sort

Add an interactive sort to your list view, even offline!
It supports sorting on a single field similar to the built-in list view sort capabilities.

## Features
* Sort through a single field
* Hide / Show dropdown sort select
* When the list view is not specified, the widget will pick the closest one.

## Limitations
Supports only list views

## Dependencies
Mendix 7.6

## Demo project

[https://listviewsort.mxapps.io/](https://listviewsort.mxapps.io/)

![Not sorting](/assets/LV_Normal_Offline.jpg)

![Sorting](/assets/LV_Searching_Offline.jpg)

## Usage

### Data source configuration

![Data source](/assets/Datasource.png)
 - On the `List view name` option of the `Data source` tab, input the "name" property of the list widget you want to search in.
 - On the `Sort attributes` option of the `Data source` tab, input the name of the field or attribute on the list widget entity to be searched. You must enter the name of the attribute manually, exactly as it appears in the domain model.

### Data source configuration


## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/listview-filter/issues](https://github.com/mendixlabs/listview-filter/issues).


## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone https://github.com/mendixlabs/listview-filter.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/mendixlabs/listview-filter/releases/latest](https://github.com/mendixlabs/listview-filter/latest)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt

To run the project unit tests with code coverage, results can be found at dist/testresults/coverage/index.html, run:

    npm test

or run the test continuously during development:

    karma start
