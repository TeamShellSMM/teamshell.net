module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        //target: 'http://localhost:8080' ,
        target: 'https://makerteams.net/backend' ,
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      },
    },
  disableHostCheck:true
  }
}