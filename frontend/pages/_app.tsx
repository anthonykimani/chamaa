import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
import celoGroups from '@celo/rainbowkit-celo/lists';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Outfit as FontSans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ClientOnly from '@/components/CllientOnly';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;
const { chains, publicClient } = configureChains([Celo], [publicProvider()]);

// const connectors = [new InjectedConnector({ chains })];
const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Chama",
});

const appInfo = {
  appName: 'Celo Composer',
};

const wagmiConfig = createConfig({
  connectors,
  publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${fontSans.style.fontFamily};
        }
      `}</style>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
          <ClientOnly>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ClientOnly>

          <Toaster position='top-center' />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
