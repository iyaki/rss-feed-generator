import fs from 'fs'
import { newExtractor } from './webPageExtractor.js'


export function process(articlesConfig) {
	const html = fs.readFileSync(articlesConfig.htmlPath, { encoding: 'utf8' })

	const limit = articlesConfig.limit
	const newerThan = addMonths(new Date(), -6).toISOString()
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

		if (!item.date || newerThan < item.date) {
			items.push(item)
		}
	}

	return items
}

function getDaysInMonth (year, month) {
	return new Date(year, month, 0).getDate()
}

function addMonths(input, months) {
  const date = new Date(input)
  date.setDate(1)
  date.setMonth(date.getMonth() + months)
  date.setDate(Math.min(input.getDate(), getDaysInMonth(date.getFullYear(), date.getMonth()+1)))
  return date
}
