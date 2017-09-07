[![Build Status](https://travis-ci.org/mendixlabs/listview-filter.svg?branch=master)](https://travis-ci.org/mendixlabs/listview-filter)
[![Dependency Status](https://david-dm.org/mendixlabs/listview-filter.svg)](https://david-dm.org/mendixlabs/listview-filter)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/listview-filter.svg#info=devDependencies)](https://david-dm.org/mendixlabs/listview-filter#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/listview-filter/branch/master/graph/listview-filter.svg)](https://codecov.io/gh/mendixlabs/listview-filter)
[![badge](https://img.shields.io/badge/mendix-7.6.0-green.svg)
# Dropdown sort

Add an interactive sort to your list view.
It supports sorting on a single field similar to the built-in list view sort capabilities.

## Features
* Sort through a single field
* Hide / Show dropdown sort select
* When the list view is not specified, the widget will pick the closest one.

## Dependencies
Mendix 7.6

## Demo project

[https://listviewsort.mxapps.io/](https://listviewsort.mxapps.io/)

![Demo](/assets/demo.gif)

## Usage

### Data source configuration

![Data source](/assets/Datasource.png)
 - On the `List view name` option of the `Data source` tab, input the "name" property of the list widget you want to search in.
 - On the `Sort attributes` option of the `Data source` tab, input the name of the field or attribute on the list widget entity to be searched. You must enter the name of the attribute manually, exactly as it appears in the domain model.

### Data source configuration


## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/listview-filter/issues](https://github.com/mendixlabs/listview-filter/issues).


## Development and contribution
Please follow [development guide](/development.md).
