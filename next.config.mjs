// next.config.mjs
import withPlugins from "next-compose-plugins";
import transpileModules from "next-transpile-modules";

const withTM = transpileModules(["styled-components"]);

const nextConfig = {
  webpack(config, options) {
    return config;
  },
};

export default withPlugins([withTM], nextConfig);
