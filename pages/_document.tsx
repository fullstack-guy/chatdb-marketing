import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html className="h-full">
        <Head />
        <body className="h-full min-h-full bg-layer-1 text-text antialiased light">
          <Main />
          <NextScript />
          <svg width="0" height="0">
            <defs>
              <LinearGradient name="peach" />
              <LinearGradient name="sky" />
              <LinearGradient name="lime" />
              <LinearGradient name="dusk" />
              <LinearGradient name="cotton-candy" />
              <LinearGradient name="wild-apple" />
              <LinearGradient name="fresh-mint" />
              <LinearGradient name="grape-gummy" withVia />
            </defs>
          </svg>
          <script
            dangerouslySetInnerHTML={{ __html: `!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});` }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.Beacon('init', '18ef39ce-1b8b-4f08-9cb6-3dd11dbd0fd7')` }} />
        </body>
      </Html>
    );
  }
}

function LinearGradient({
  name,
  withVia,
}: {
  name: string;
  withVia?: boolean;
}) {
  return (
    <linearGradient id={`gradient-${name}`}>
      <stop offset="0%" style={{ stopColor: `var(--gradient-${name}-from)` }} />
      {withVia ? (
        <stop
          offset="50%"
          style={{ stopColor: `var(--gradient-${name}-via)` }}
        />
      ) : null}
      <stop offset="100%" style={{ stopColor: `var(--gradient-${name}-to)` }} />
    </linearGradient>
  );
}
