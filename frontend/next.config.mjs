/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "media.licdn.com",
          port: "",
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
          port: "",
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "anthonykimani.github.io",
          port: "",
          pathname: "**",
        },
      ],
    },
  };
  
  export default nextConfig;
  