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
      {
        protocol: 'http', 
        hostname: 'localhost',
        port: '8080', 
        pathname: '/documents/**', 
      },
      {
        protocol: 'https',
        hostname: 'interconsulta.org',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'interconsulta.org',
        port: '',
        pathname: '/icons/**'
      },
      {
        protocol: 'https',
        hostname: 'interconsulta.org',
        port: '',
        pathname: '/icons-doencas/**',
      },
      {
        protocol: 'https',
        hostname: 'interconsulta.org',
        port: '',
        pathname: '/documents/**',
      }
    ],
  },
};
