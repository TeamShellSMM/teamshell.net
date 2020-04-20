module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: process.env.NODE_ENV !== 'production' ? 'http://makerteams.net:4000' : 'https://teamshell.net/backend',
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      },
    },
  disableHostCheck:true
  }
}
