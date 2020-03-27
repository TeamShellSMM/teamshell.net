module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: process.env.NODE_ENV !== 'production' ? 'http://teamshell.net:4000' : 'https://teamshell.net/backend',
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      }
    }
  }
}