const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

module.exports = {
    entry: '/src/client/static/js/webpack_index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/client/static/js/dist'),
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            // https://nodejs.org/api/process.html#process_process_env
            OPENAI_API_KEY: JSON.stringify(process.env.OPENAI_API_KEY),
            SUPABASE_API_KEY: JSON.stringify(process.env.SUPABASE_API_KEY),
            SUPABASE_URL: JSON.stringify(process.env.SUPABASE_URL)
          }
        })
    ],
    mode: 'development'
};