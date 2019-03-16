# Trias Beta
[![GitHub license](https://img.shields.io/badge/license-GPL3.0-blue.svg)](https://github.com/triasteam/triasBeta/blob/master/LICENSE.md)
[![Build Status](https://travis-ci.org/triasteam/triasBeta.svg)](https://travis-ci.org/triasteam/triasBeta)

This project is a web portal which displays statistics and data of the Trias Beta system.

## Requirements
|Requirement|Notes|
|:-----|:---|
|python|3.4 or later|
|Django|1.10.4 or later|
|django-webpack-loader|0.2.4|
|react|16.3.2|
|webpack|2.7.0|

## Documentation
For more documention about Trias, see [Trias White Paper](https://www.trias.one/whitepaper).

### Install
Install dependencies: 

```
pip3 install -r requirements.txt
```
```
npm install
```

### Quick Start
- Development mode, run `webpack-dev-server`: 
  
  `npm start`
  
- Production mode, run `webpack`: 
  
  `npm run build`

Then, start the django server: 

`python3 manage.py runserver`

Finally, open http://localhost:8000 .

### How To Use?
See [Trias Beta User Manual](https://github.com/triasteam/triasBeta/blob/master/docs/TriasBetaUserManual.md).

### Directory Description
|Directory|Description|
|:-----|:---|
|**app_views/**|This directory is used for Django custom application *app*.|
|**conf/**|This directory contains Django configuration files for deployment.|
|**html/**|This directory contains source code of web views such as web page assets files, react components, bundles and so on.|
|**trias_beta/**|This directory is used for Django custom peject.|

## A Note on Production Readiness

While Trias is being used in production in private, permissioned
environments, we are still working actively to harden and audit it in preparation
for use in public blockchains.
We are also still making breaking changes to the protocol and the APIs.
Thus, we tag the releases as *alpha software*.

In any case, if you intend to run Trias in production,
please [contact us](mailto:contact@trias.one) and [join the chat](https://www.trias.one).

## Security

To report a security vulnerability,  [bug report](mailto:contact@trias.one)

## Contributing

All code contributions and document maintenance are temporarily responsible for TriasLab.

Trias are now developing at a high speed and we are looking forward to working with quality partners who are interested in Trias. If you want to join，please contact us:
- [Telegram](https://t.me/triaslab)
- [Medium](https://medium.com/@Triaslab)
- [BiYong](https://0.plus/#/triaslab)
- [Twitter](https://twitter.com/triaslab)
- [Gitbub](https://github.com/trias-lab/Documentation)
- [Reddit](https://www.reddit.com/r/Trias_Lab)
- [More](https://www.trias.one/)
- [Email](mailto:contact@trias.one)


### Upgrades

Trias is responsible for the code and documentation upgrades for all Trias modules. In an effort to avoid accumulating technical debt prior to Beta, we do not guarantee that data breaking changes (ie. bumps in the MINOR version) will work with existing Trias blockchains. In these cases you will have to start a new blockchain, or write something custom to get the old data into the new chain.

## Resources

### Research

* [The latest paper](https://www.contact@trias.one/attachment/Trias-whitepaper%20attachments.zip)
* [Project process](https://trias.one/updates/project)
* [Original Whitepaper](https://trias.one/whitepaper)
* [News room](https://trias.one/updates/recent)
