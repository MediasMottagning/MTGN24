/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
          fs: false,
          child_process: false,
          net: false, // This needs to be set to false in order for the API route getCalendarEvents to work
          tls: false,
        };
    
        return config;
      },
};

export default nextConfig;
