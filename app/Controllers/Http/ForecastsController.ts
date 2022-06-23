import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

const GRID_URL =
  'https://geocoding.geo.census.gov/geocoder/locations/address?benchmark=2020&format=json&'
const POINTS_URL = 'https://api.weather.gov/points/'
const FORECAST_URL = 'https://api.weather.gov/gridpoints/'

export default class ForecastsController {
  public async getForecast({ request, response }: HttpContextContract) {
    const all: {
      address?: string
      zip?: string
      units?: string
      number?: number
    } = request.all()

    if (!all.address) {
      return response.status(400).send({ msg: 'You must send a direction' })
    }
    if (!all.zip) {
      return response.status(400).send({ msg: 'You must send a zip code' })
    }

    const gridUrl = GRID_URL + 'street=' + all.address + '&zip=' + Number(all.zip)

    try {
      const grids = await axios.get(gridUrl)
      const dataGrids = grids.data

      if (!dataGrids.result.addressMatches || dataGrids.result.addressMatches.length <= 0) {
        return response.status(400).send({ msg: 'Direction not found' })
      }

      const coordinates = dataGrids.result.addressMatches[0]
      const pointsUrl = POINTS_URL + coordinates.coordinates.y + ',' + coordinates.coordinates.x

      const pointsCall = await axios.get(pointsUrl)
      const dataPoints = pointsCall.data.properties

      const forecastUrl =
        FORECAST_URL +
        dataPoints.gridId +
        '/' +
        dataPoints.gridX +
        ',' +
        dataPoints.gridY +
        '/forecast?units=' +
        (all.units ?? 'si')

      const allForecast = await axios.get(forecastUrl)
      let periods = []
      if (all.number) {
        periods = allForecast.data.properties.periods
          .filter(
            (period) =>
              period.name === 'Today' ||
              period.name === 'Monday' ||
              period.name === 'Tuesday' ||
              period.name === 'Wednesday' ||
              period.name === 'Thursday' ||
              period.name === 'Friday' ||
              period.name === 'Saturday' ||
              period.name === 'Sunday'
          )
          .slice(0, all.number)
      } else {
        periods = allForecast.data.properties.periods
      }

      return response.send({
        forecast: {
          ...allForecast.data.properties,
          periods,
        },
        address: dataGrids.result.addressMatches[0].addressComponents,
      })
    } catch (error) {
      return response.status(400).send({
        msg: 'Something went wrong',
        error: error,
      })
    }
  }
}
