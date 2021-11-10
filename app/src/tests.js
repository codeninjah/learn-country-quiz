import assert from 'assert'
import { randomFlagObject, randomQuestions } from './utils.js'


describe("randomQuestions", () => {
  it('returns a unique list of countries', () => {
    const response = randomFlagObject()
    const countryArray = Object.values(response.alternatives)
    const unique = [...new Set(countryArray)]

    assert.equal(unique.length, 4)
  })
  it('returns a unique list of answers', () => {
    const response = randomQuestions(5)
    const countryArray = []
    for (let i = 0; i < Object.keys(response).length; i++) {
      countryArray.push(response[i].correct)
    }

    const unique = [...new Set(countryArray)]

    assert.equal(unique.length, 5)
  })
})

