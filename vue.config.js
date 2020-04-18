module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: process.env.NODE_ENV !== 'production' ? 'https://teamshell.net/backend' : 'https://teamshell.net/backend',
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      },
    },
  disableHostCheck:true
  }
}
