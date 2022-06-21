## Server to get Forecast

This Back-End project contains a server in NodeJS, only expose a endpoint to get the forecast for a specific address. The server is base on a framework called [AdoniJS](https://adonisjs.com/).

To run the server on development mode you have to run the command:
```sh
npm run dev
```

There are neccessary 3 parameters:
| Parameter | Type | Description |
| ----- | ------ | -------|
| address | string | Address to search |
| zip | string or number | Zip code of the direction |
| units | string: 'si' or 'us' | Metric units to get the temperature |