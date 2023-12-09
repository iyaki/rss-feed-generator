import RSS from 'rss'

export function newRssFeed(config) {
	const feed = new RSS(config);

	return {
		addArticle(article) {
			feed.item(article)
		},
		addArticles(articles) {
			for (const article of articles) {
				this.addArticle(article)
			}
		},
		getXml() {
			return feed.xml({indent: true})
		}
	}
}
