[![Build Status](https://travis-ci.org/mendixlabs/listview-filter.svg?branch=master)](https://travis-ci.org/mendixlabs/listview-filter)
[![Dependency Status](https://david-dm.org/mendixlabs/listview-filter.svg)](https://david-dm.org/mendixlabs/listview-filter)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/listview-filter.svg#info=devDependencies)](https://david-dm.org/mendixlabs/listview-filter#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/listview-filter/branch/master/graph/listview-filter.svg)](https://codecov.io/gh/mendixlabs/listview-filter)
![badge](https://img.shields.io/badge/mendix-7.6.0-green.svg)

# Drop-down sort

Add an interactive sort to your list view.
It supports sorting on a single field similar to the built-in list view sort capabilities.

## Features
* Sort through a single field
* Specify an option to sort list view items on load. If multiple defaults are selected, the widget will select the first one.
* If no default select option is specified the widget will always select the first one.

## Dependencies
Mendix 7.6

## Demo project

[https://listviewsort.mxapps.io/](https://listviewsort.mxapps.io/)

![Demo](/assets/demo.gif)

## Usage

### Data source configuration

![Data source](/assets/Datasource.png)
 - On the `List view entity` option of the `Data source` tab, browse and 
 select the "entity" property of the list widget you want to sort.
 This `entity` must be the one used on the list view.
 
 ![Data source](/assets/SortAttributes.png)
 
 - On the `Sort attributes` option of the `Data source` tab, browse and 
 select the attribute on the list widget entity to be sorted. 
 
 
 ![Data source](/assets/SortAttributesItems.png)

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/listview-sort/issues](https://github.com/mendixlabs/listview-sort/issues).


## Development and contribution
Please follow [development guide](/development.md).
