const http = require('http')

http.createServer(async (_, res) => {
  res.writeHead(200)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  res.end(`hello world\n${process.pid}`)
}).listen(8000)
