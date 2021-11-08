import assert from 'assert'
import { randomFlags } from './utils.js'


describe("randomQuestions", () => {
  it('returns a unique list of countries', () => {
    const response = randomFlags()
    const countryArray = Object.values(response.alternatives)
    console.log(countryArray)
    const unique = [...new Set(countryArray)]

    assert.equal(unique.length, 4)
  })
})