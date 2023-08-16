import fs from 'fs'
import { newRssFeed } from './rss.js'
import { process as processArticles } from './articles.js'


const args = process.argv.slice(2)

if (args.length === 0) {
	throw new Error('ERROR: El script requiere un argumento, el path al archivo de configuración')
}

const config = JSON.parse(fs.readFileSync(args[0], { encoding: 'utf8' }))

const { articles: articlesConfig, feedPath, ...feedConfig } = config

const rss = newRssFeed(feedConfig)

const articles = processArticles(articlesConfig)

rss.addArticles(articles)

fs.writeFileSync(feedPath, rss.getXml())
