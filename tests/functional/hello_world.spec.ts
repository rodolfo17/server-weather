import { test } from '@japa/runner'

test('No parameters sent', async ({ client }) => {
  const response = await client.get('/forecast')

  response.assertStatus(400)
  response.assertBodyContains({ msg: 'You must send a direction' })
})

test('Get forecast', async ({ client }) => {
  const response = await client.get('/forecast?address=514 w cevallos&zip=78204&units=si')

  response.assertStatus(200)
  response.assertBodyContains({ forecast: { periods: [] } })
})
