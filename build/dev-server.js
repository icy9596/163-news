require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

let cheerio = require('cheerio');
let request = require('request');

app.use('/api', (function(){
  let router = express.Router();

  // 获取新闻内容
  router.get('/getNewDetail/:docId', (req, res, next) => {
    let docId = req.params.docId;
    let url = `http://3g.163.com/all/article/${docId}.html`
    request(url, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let $ = cheerio.load(body);
        let result = {
          title: '',
          info: '',
          content: '',
          imgs: []
        }

        let photos = $('.photo img');
        photos.each((i, v) => {
          v = $(v);
          let src = v.attr('data-src');
          let alt = v.attr('alt');
          result.imgs.push({
            src: src,
            alt: alt
          });
        });
        
        let video = $('video');
        let vSrc = video.attr('data-src');
        video.attr('src', vSrc);

        let contents = $('.page p');
        contents.each((i, v) => {
          let content = $(v).text();
          result.content += `<p>${content}</p>`;
        });

        result.title = $('h1.title').text();
        result.info = $('.info').html();

        res.json(result);
      }

      next();
    });
  });
  // 获取新闻结束

  // 获取图集内容
  router.get('/getPhoto/:id', (req, res, next) => {
    let typeIdArr = req.params.id.split('|');
    let url = `https://3g.163.com/photo/photoview/${typeIdArr[0]}/${typeIdArr[1]}.html`;

    request(url, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        let data = {
          title: '',
          imgs: []
        }
        let $ = cheerio.load(body);
        data.title = $('h1.album_title').text();
        let imgsItem = $('.photo_list .img-wrap');
        imgsItem.each((i, item) => {
          item = $(item);
          data.imgs.push({
            src: item.find('img').attr('data-src'),
            note: item.find('.note').text()
          });
        });

        res.json(data);

        next();
      }
    });
  });
  // 获取图集内容结束

  return router;
})());

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
