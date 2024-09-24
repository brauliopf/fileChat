import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(path.resolve(), "./config/.env") });

console.log(path.join(path.resolve(), "./config/.env"))

export default {
  entry: '/src/public/js/webpack.js',
  output: {
    filename: 'bundle.js',
    path: path.join(path.resolve(), 'src/public/js/dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
      OPENAI_API_KEY: JSON.stringify(process.env.OPENAI_API_KEY),
      SUPABASE_API_KEY: JSON.stringify(process.env.SUPABASE_API_KEY),
      SUPABASE_URL: JSON.stringify(process.env.SUPABASE_URL)
      }
    })
  ],
  mode: 'development'
};