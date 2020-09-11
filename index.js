const got = require(`got`)
const crypto = require(`crypto`)

function buildUrlParams(keyValuePairs) {
	return Object.keys(keyValuePairs)
		.reduce((urlParamString, urlParam, index) => {
			const param = `${ urlParam }=${ encodeURIComponent(keyValuePairs[urlParam]) }`

			return urlParamString + (index === 0 ? `?` : `&`) + param
		}, ``)
}

module.exports = initialize = (apiKey, userAgent = `haveibeenpwned v3 node wrapper`) => {
	const hibpRequestExtension = got.extend({
		prefixUrl: `https://haveibeenpwned.com/api/v3/`,
		headers: { 'hibp-api-key': apiKey, 'user-agent': userAgent },
		responseType: `json`,
	})

	const hibpRequest = async (...args) => {
		const response = await hibpRequestExtension(...args)
		return response.body
	}

	return {
		breachedAccount(account, options = {}) {
			return hibpRequest(`breachedaccount/${encodeURIComponent(account)}${buildUrlParams(options)}`)
		},
		breaches(options = {}) {
			return hibpRequest(`breaches${buildUrlParams(options)}`)
		},
		breach(name) {
			return hibpRequest(`breach/${encodeURIComponent(name)}`)
		},
		dataClasses() {
			return hibpRequest(`dataclasses`)
		},
		async pasteAccount(account) {
			try {
				return await hibpRequest(`pasteaccount/${encodeURIComponent(account)}`)
			} catch(err) {
				if(err.response.statusCode === 404) {
					//Not found — the account could not be found and has therefore not been pwned
					return []
				} else {
					throw err
				}
			}
		},
		async pwnedPassword(password, options = {}) {
			const hash = crypto.createHash(`sha1`).update(password).digest('hex').toUpperCase()
			const hashFirstFive = hash.substring(0,5)
			const headers = options.addPadding ? { 'Add-Padding': true } : {}

			try {
				const { body } = await got(`https://api.pwnedpasswords.com/range/${encodeURIComponent(hashFirstFive)}`, { headers })
				
				const parsedLines = body.split('\r\n').map(line => {
					const [ hashSuffix, count ] = line.split(':')
					return [ `${hashFirstFive}${hashSuffix}`, parseInt(count) ]
				})
				console.log(parsedLines.length)
				const hashList = Object.fromEntries(parsedLines)

				return hashList[hash] || 0
			} catch(err) {
				throw err
			}
		},
	}
}