module.exports = {
  webpack: {
    configure(webpackConfig) {
      if (webpackConfig.mode === 'production') {
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            antd: {
              name: 'antd-chunk',
              test: /antd/,
              priority: 10
            },
            reactDom: {
              name: 'reactDom-chunk',
              test: /react-dom/,
              priority: 9
            },
            vendors: {
              name: 'vendors-chunk',
              test: /node_modules/,
              priority: 8
            }
          }
        }
      }
      return webpackConfig
    }
  },
  devServer: {
    client: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
