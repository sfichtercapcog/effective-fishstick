import "@/styles/global.css";
import '@/styles/grants.css';
import '@/styles/newsletter.css';
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
