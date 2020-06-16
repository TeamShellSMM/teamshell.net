module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: process.env.API_HOST || 'http://makerteams.net:4000' ,
        pathRewrite: {'^/backend' : ''},
        changeOrigin: true,
        secure: false,
      },
    },
  disableHostCheck:true
  }
}