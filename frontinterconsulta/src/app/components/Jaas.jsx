'use client'

import { useEffect, useState } from 'react';

const JaasComponent = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadJitsiScript = async () => {
      const script = document.createElement('script');
      script.src =
        'https://8x8.vc/vpaas-magic-cookie-21c1473964e545b582ea460f6a9d0a94/external_api.js';
      document.body.appendChild(script);

      script.onload = () => {
        if (window.JitsiMeetExternalAPI) {
          const api = new window.JitsiMeetExternalAPI("8x8.vc", {
            roomName: "vpaas-magic-cookie-21c1473964e545b582ea460f6a9d0a94/Consultório Médico",
            parentNode: document.querySelector('#jaas-container'),
          });
        } else {
          console.error('JitsiMeetExternalAPI not available');
        }
      };
    };

    if (!scriptLoaded) {
      loadJitsiScript()
      setScriptLoaded(true)
    }
  }, [scriptLoaded]);

  return (
    <>
    {scriptLoaded &&
    <div
    id="jaas-container"
    className="min-h-[93vh] w-full flex items-center justify-center"
    ></div>
    }
    </>
  );
};

export default JaasComponent
