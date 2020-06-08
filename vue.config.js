module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: 'http://makerteams.net:4000' ,
        //target: 'https://makerteams.net/backend' ,
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      },
    },
  disableHostCheck:true
  }
}