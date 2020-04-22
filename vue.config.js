module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: 'http://makerteams.net:4000' ,
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      },
    },
  disableHostCheck:true
  }
}