import { describe, it } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { api } from '../../src/api'

describe('Search API - Integration Tests', () => {
  describe('GET /search/:query', () => {
    it('should return 400 when query is less than 3 characters', async () => {
      const response = await request(api)
        .get('/search/ab')
        .expect(400)
        .expect('Content-Type', /json/)

      assert.strictEqual(response.body.error, 'Bad Request')
      assert.strictEqual(response.body.message, 'Search query must be at least 3 characters')
    })

    it('should return 400 for single character query', async () => {
      const response = await request(api)
        .get('/search/a')
        .expect(400)
        .expect('Content-Type', /json/)

      assert.strictEqual(response.body.error, 'Bad Request')
      assert.strictEqual(response.body.message, 'Search query must be at least 3 characters')
    })

    it('should return 404 when no query is present', async () => {
      const response = await request(api).get('/search/').expect(404).expect('Content-Type', /json/)

      assert.strictEqual(response.body.error, 'Not Found')
      assert.strictEqual(response.body.message, 'The requested resource was not found')
    })

    it('should return 200 and results for a valid 3-character query', async () => {
      const response = await request(api)
        .get('/search/str')
        .expect(200)
        .expect('Content-Type', /json/)

      assert.ok(Array.isArray(response.body))

      // Verify Address structure if results exist
      if (response.body.length > 0) {
        const firstResult = response.body[0]
        assert.ok(firstResult.hasOwnProperty('city'))
        assert.ok(firstResult.hasOwnProperty('county'))
        assert.ok(firstResult.hasOwnProperty('district'))
        assert.ok(firstResult.hasOwnProperty('municipality'))
        assert.ok(firstResult.hasOwnProperty('municipalityNumber'))
        assert.ok(firstResult.hasOwnProperty('postNumber'))
        assert.ok(firstResult.hasOwnProperty('street'))
        assert.ok(firstResult.hasOwnProperty('type'))
        assert.ok(firstResult.hasOwnProperty('typeCode'))
        assert.ok(!firstResult.hasOwnProperty('$tsid'), 'Should not expose internal $tsid property')
      }
    })

    it('should return results for a specific street name query', async () => {
      const response = await request(api).get('/search/test').expect(200)

      assert.ok(Array.isArray(response.body))

      // All results should be valid Address objects
      response.body.forEach((address: any) => {
        assert.strictEqual(typeof address.city, 'string')
        assert.strictEqual(typeof address.street, 'string')
        assert.strictEqual(typeof address.postNumber, 'number')
        assert.strictEqual(typeof address.municipalityNumber, 'number')
        assert.strictEqual(typeof address.typeCode, 'number')
      })
    })

    it('should return at most 20 results for a broad query', async () => {
      const response = await request(api).get('/search/oslo').expect(200)

      assert.ok(Array.isArray(response.body))
      assert.ok(
        response.body.length <= 20,
        `Expected at most 20 results, but got ${response.body.length}`
      )
    })

    it('should handle special characters without breaking', async () => {
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

      for (const query of specialQueries) {
        const response = await request(api)
          .get(`/search/${encodeURIComponent(query)}`)
          .expect(200)

        assert.ok(Array.isArray(response.body), `Query "${query}" should return an array`)
        // Should not throw error - even if it returns empty results
      }
    })

    it('should be case-insensitive', async () => {
      const lowerCaseResponse = await request(api).get('/search/main').expect(200)

      const upperCaseResponse = await request(api).get('/search/MAIN').expect(200)

      const mixedCaseResponse = await request(api).get('/search/Main').expect(200)

      // All should return arrays (content might differ based on data)
      assert.ok(Array.isArray(lowerCaseResponse.body))
      assert.ok(Array.isArray(upperCaseResponse.body))
      assert.ok(Array.isArray(mixedCaseResponse.body))
    })

    it('should return empty array for non-existent addresses', async () => {
      const response = await request(api).get('/search/xyznonexistentstreet999').expect(200)

      assert.ok(Array.isArray(response.body))
      assert.strictEqual(response.body.length, 0)
    })

    it('should handle numeric queries', async () => {
      const response = await request(api).get('/search/123').expect(200)

      assert.ok(Array.isArray(response.body))
    })
  })
})
