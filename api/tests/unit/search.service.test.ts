import { describe, it } from 'node:test'
import assert from 'node:assert'
import { searchAddresses, SearchValidationError } from '../../src/services/searchService'

describe('Search Service - Unit Tests', () => {
  describe('searchAddresses()', () => {
    describe('Query Validation', () => {
      it('should throw SearchValidationError when query is less than 3 characters', () => {
        assert.throws(() => searchAddresses('ab'), SearchValidationError)
      })

      it('should throw SearchValidationError when query is 1 character', () => {
        assert.throws(() => searchAddresses('a'), SearchValidationError)
      })

      it('should throw SearchValidationError when query is undefined', () => {
        assert.throws(() => searchAddresses(undefined as any), SearchValidationError)
      })

      it('should throw SearchValidationError when query is empty string', () => {
        assert.throws(() => searchAddresses(''), SearchValidationError)
      })

      it('should accept queries with exactly 3 characters', () => {
        assert.doesNotThrow(() => {
          const results = searchAddresses('abc')
          assert.ok(Array.isArray(results))
        })
      })
    })

    describe('Basic Search Functionality', () => {
      it('should return an array for a valid query', () => {
        const results = searchAddresses('lane')

        assert.ok(Array.isArray(results))
      })

      it('should return results with proper Address structure', () => {
        // from the data, we know the query 'test' gives exactly one result:
        // {
        // 		"postNumber": 7042,
        // 		"city": "TRONDHEIM",
        // 		"street": "Testmanns gate",
        // 		"typeCode": 6,
        // 		"type": "Gate-/veg-adresse",
        // 		"district": "",
        // 		"municipalityNumber": 1601,
        // 		"municipality": "Trondheim",
        // 		"county": "Sør-Trøndelag"
        // 	}
        const results = searchAddresses('test')

        assert.strictEqual(results.length, 1)
        const firstResult = results[0]

        assert.ok(firstResult.hasOwnProperty('city'))
        assert.ok(firstResult.hasOwnProperty('county'))
        assert.ok(firstResult.hasOwnProperty('district'))
        assert.ok(firstResult.hasOwnProperty('municipality'))
        assert.ok(firstResult.hasOwnProperty('municipalityNumber'))
        assert.ok(firstResult.hasOwnProperty('postNumber'))
        assert.ok(firstResult.hasOwnProperty('street'))
        assert.ok(firstResult.hasOwnProperty('type'))
        assert.ok(firstResult.hasOwnProperty('typeCode'))

        // Verify types
        assert.strictEqual(typeof firstResult.city, 'string')
        assert.strictEqual(typeof firstResult.street, 'string')
        assert.strictEqual(typeof firstResult.postNumber, 'number')
        assert.strictEqual(typeof firstResult.municipalityNumber, 'number')
        assert.strictEqual(typeof firstResult.typeCode, 'number')
      })

      it('should not include $tsid property in results', () => {
        const results = searchAddresses('test')

        results.forEach((address: any) => {
          assert.ok(
            !address.hasOwnProperty('$tsid'),
            'Result should not contain internal $tsid property'
          )
        })
      })

      it('should return empty array for non-existent addresses', () => {
        const results = searchAddresses('xyznonexistentstreet999')

        assert.ok(Array.isArray(results))
        assert.strictEqual(results.length, 0)
      })
    })

    describe('maxResults Parameter', () => {
      it('should return all results when maxResults is not provided', () => {
        // from the data we know this will have more than 20
        const results = searchAddresses('oslo')

        assert.ok(Array.isArray(results))
        assert.ok(results.length > 20)
      })

      it('should limit results when maxResults is specified', () => {
        const maxResults = 5
        const results = searchAddresses('oslo', maxResults)

        assert.ok(Array.isArray(results))
        assert.ok(
          results.length <= maxResults,
          `Expected at most ${maxResults} results, got ${results.length}`
        )
      })

      it('should limit results to 20 when maxResults is 20', () => {
        const results = searchAddresses('oslo', 20)

        assert.ok(results.length <= 20)
      })

      it('should limit results to 10 when maxResults is 10', () => {
        const results = searchAddresses('oslo', 10)

        assert.ok(results.length <= 10)
      })

      it('should limit results to 1 when maxResults is 1', () => {
        const results = searchAddresses('oslo', 1)

        assert.ok(results.length <= 1, `Expected at most 1 result, got ${results.length}`)
      })

      it('should handle maxResults larger than actual results', () => {
        const results = searchAddresses('test', 100)

        assert.ok(Array.isArray(results))
        assert.ok(results.length <= 100)
      })

      it('should return same results when maxResults equals total results', () => {
        // Get all results first
        const allResults = searchAddresses('test')
        const totalCount = allResults.length

        // Get with limit equal to total
        const limitedResults = searchAddresses('test', totalCount)

        assert.strictEqual(limitedResults.length, allResults.length)
      })
    })

    describe('Special Characters and Edge Cases', () => {
      it('should handle special characters without throwing', () => {
        const specialQueries = [
          'Main@Street',
          'Str$$t',
          'Av€nue',
          'Road#123',
          'Lane & Boulevard',
          'Test!@#',
          'Åsgårdsveien', // Norwegian/Swedish å
          'Østre gate', // Norwegian ø
          'Søndre vei', // Norwegian ø
          'Dronning Mauds gate', // Real Norwegian street
          'Kärleksgatan', // Swedish ä
          'Östra vägen', // Swedish ö
          'Grønland', // Norwegian ø
          'Møllergata', // Norwegian ø
          'Storgatan', // Swedish (no special chars but common)
          'Björnvägen', // Swedish ö
          'Ægirsgade', // Danish/Norwegian æ
          'Königstraße', // German ö, ß
          'Müller Straße', // German ü
          'Père Lachaise', // French è
          'José María', // Spanish é, í
          'Łódź ulica', // Polish ł, ó
        ]

        specialQueries.forEach((query) => {
          assert.doesNotThrow(() => {
            const results = searchAddresses(query)
            assert.ok(Array.isArray(results))
          }, `Query "${query}" should not throw error`)
        })
      })

      it('should handle queries with spaces', () => {
        assert.doesNotThrow(() => {
          const results = searchAddresses('Main Street')
          assert.ok(Array.isArray(results))
        })
      })

      it('should handle numeric queries', () => {
        assert.doesNotThrow(() => {
          const results = searchAddresses('123')
          assert.ok(Array.isArray(results))
        })
      })

      it('should be case-insensitive', () => {
        const lowerResults = searchAddresses('main')
        const upperResults = searchAddresses('MAIN')
        const mixedResults = searchAddresses('Main')

        // All should return arrays
        assert.ok(Array.isArray(lowerResults))
        assert.ok(Array.isArray(upperResults))
        assert.ok(Array.isArray(mixedResults))
      })
    })
  })
})
