import Script from "next/script"

export const ScriptsSocials = () => {
    return (
        <>
  <head>
        {/* Meta tag de verificação do Google */}
        <meta name="google-site-verification" content="FKYy_DJtljy6hYA4y7URZOS6xqc2-jlWDFZPvZQjTwo"/>        {/* Meta tag de verificação do Facebook */}
        <meta name="facebook-domain-verification" content="ev6rgb99es8cruxsiir09ntwmv2yqn"/>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="lazyOnload" dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2228702834001265');
            fbq('track', 'PageView');
          `,
        }} />

        <noscript dangerouslySetInnerHTML={{
          __html: `
          <img 
            height="1" 
            width="1" 
            style="display:none"
            src="https://www.facebook.com/tr?id=2228702834001265&ev=PageView&noscript=1"
          />
          `,
        }}/>

        { /* Google  */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-11476579486" strategy="lazyOnload" />
        <Script id="google-tag-manager-1" strategy="lazyOnload" dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'AW-11476579486');
              `,
            }} />  
        { /* Google Analytics  */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-9BND46GSNV" strategy="lazyOnload"/>
        <Script id="google-tag-manager-2" strategy="lazyOnload" dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-9BND46GSNV');
          `,
        }} />
      </head>
        </>
    )   
}