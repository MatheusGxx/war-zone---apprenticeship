/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', 
        hostname: 'localhost',
        port: '8080', 
        pathname: '/uploads/**', 
      },
      {
        protocol: 'http', 
        hostname: 'localhost',
        port: '8080', 
        pathname: '/icons/**', 
      },
      {
        protocol: 'http', 
        hostname: 'localhost',
        port: '8080', 
        pathname: '/icons-doencas/**', 
      },
    ],
  },
};
