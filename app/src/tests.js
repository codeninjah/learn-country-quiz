import assert from 'assert'
import { randomFlags, randomQuestions } from './utils.js'


describe("randomQuestions", () => {
  it('returns a unique list of countries', () => {
    const response = randomFlags()
    const countryArray = Object.values(response.alternatives)
    const unique = [...new Set(countryArray)]

    assert.equal(unique.length, 4)
  })
  it('returns a unique list of answers', () => {
    const response = randomQuestions
    const countryArray = []
    for (let i = 0; i < Object.keys(response).length-1; i++) {
      countryArray.push(response[i+1].correct)
    }
    const unique = [...new Set(countryArray)]

    assert.equal(unique.length, 4)
  })
})

