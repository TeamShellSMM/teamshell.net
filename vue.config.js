module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: 'http://teamshell.net:4000',
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      }
    }
  }
}