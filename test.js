const haveIBeenPwned = require('./index.js')()

Promise.all([
	haveIBeenPwned.breachedAccount('daytonlowell@gmail.com'),
	haveIBeenPwned.breachedAccount('daytonlowell@gmail.com', {} ),
	haveIBeenPwned.breachedAccount('daytonlowell@gmail.com', { truncateResponse: false }),
	haveIBeenPwned.breachedAccount('daytonlowell@gmail.com', { includeUnverified: true }),
	haveIBeenPwned.breaches(),
	haveIBeenPwned.breaches({ domain: 'adobe.com' }),
	haveIBeenPwned.breach('Adobe'),
	haveIBeenPwned.dataClasses(),
	haveIBeenPwned.pasteAccount('daytonlowell@me.com'),
	haveIBeenPwned.pasteAccount('daytonlowell@gmail.com'),
	haveIBeenPwned.pwnedPassword('password'),
	haveIBeenPwned.pwnedPassword('password', { addPadding: true }),
]).then(res => console.log(res))