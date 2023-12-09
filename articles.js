import fs from 'fs'
import { newExtractor } from './webPageExtractor.js'


export function process(articlesConfig) {
	const html = fs.readFileSync(articlesConfig.htmlPath, { encoding: 'utf8' })

	const limit = articlesConfig.limit
	const baseUrl = (
		articlesConfig.baseUrl
		? articlesConfig.baseUrl
		: ''
	)

	const articlesExtractor = newExtractor(html, articlesConfig.articlesSelector)

	const items = []
	for (const extractor of articlesExtractor) {
		if (items.length >= limit) {
			break
		}

		const item = {}

		item.title = extractor.getSingleValue(articlesConfig.title)

		item.description = extractor.getSingleValue(articlesConfig.description)

		item.url = baseUrl + extractor.getSingleValue(articlesConfig.url)

		if (articlesConfig.date) {
			item.date = extractor.getSingleValue(articlesConfig.date)
		}

		if (articlesConfig.guid) {
			item.guid = extractor.getSingleValue(articlesConfig.guid)
		}

		if (articlesConfig.categories) {
			item.categories = extractor.getMultiValue(articlesConfig.categories)
		}

		items.push(item)
	}

	return items
}
