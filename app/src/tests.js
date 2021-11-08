import assert from 'assert'
import {randomQuestions} from './utils.js'


describe("randomQuestions", () => {
    it("[1, 2, 3, 4, 5]", () => assert.deepEqualEqual(randomQuestions([1, 2, 3, 4, 5]), [1, 3, 5]))
  })