import { parse } from 'node-html-parser'

export function* newExtractor(html, baseSelector) {
	const fullPage = parse(html)

	const baseElements = fullPage.querySelectorAll(baseSelector)

	for (const base of baseElements) {
		yield {
			getSingleValue(prop) {
			if (prop.value) {
				return prop.value
			}

			if (prop.selector) {
				const elem = base.querySelector(prop.selector)

				if (prop.property) {
					return elem[prop.property]
				}

				if (prop.method) {
					if (prop.methodArguments) {
						return elem[prop.method](...prop.methodArguments)
					} else {
						return elem[prop.method]()
					}
				}
			}
			},
			getMultiValue(prop) {
				if (prop.value) {
					return prop.value
				}

				if (prop.selector) {
					const elems = base.querySelectorAll(prop.selector)

					if (prop.property) {
						return elems.map(elem => elem[prop.property])
					}

					if (prop.method) {
						if (prop.methodArguments) {
							return elems.map(elem => elem[prop.method](...prop.methodArguments))
						} else {
							return elems.map(elem => elem[prop.method]())
						}
					}
				}
			}
		}
	}
}
