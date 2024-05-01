'use client'
import React, { useEffect, useState } from 'react';
import ComponentToPrint from './PrintDesign'
import Button from 'react-bootstrap/Button';
// import html2pdf from '../../../../../public/html2pdf.js';
import Script from "next/script";
import { toast } from 'react-toastify';

declare var html2pdf: any;
// import html2pdf from 'html2pdf';

interface Props {
  nameFile: string,
  selectedHoles: number,
}

export default function PrintCall(props: Props) {
  const [loadScript, setLoadScript] = useState<boolean>(false)

  const ConvertToPDF = () => {
    if (loadScript) {
      // Get the div element
      const divToCapture = document.getElementById('component_print');
      if (divToCapture) {
        var opt = {
          margin: 2,
          filename: props.nameFile + '.pdf',
          image: { type: 'png', quality: 1 },
          html2canvas: { scale: 3 },
          jsPDF: { unit: 'mm', format: props.selectedHoles == 9 ? 'A5' : 'letter', orientation: 'landscape' }
        };
        html2pdf().from(divToCapture).set(opt).save();
      };
    } else {
      toast.warning("Can't Load Print Script");
    }

  };
  return (
    <div style={{
      fontSize: '20px',
      color: 'red',
      marginLeft: '15px',
      marginRight: '15px',
      alignSelf: 'center',
      cursor: 'pointer'
    }}
      onClick={ConvertToPDF}
    >
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        onError={() => alert('Error Load ')}
        onReady={() => setLoadScript(true)}
      />
      🖨
      {/* <Button
        // const content = document.getElementById("component_print");
        // const ifmcontentstoprint = document.getElementById("ifmcontentstoprint");
        // const iframe = document.createElement("iframe");
        // iframe.style.display = "none";
        // document.body.appendChild(iframe);
        // const pri = iframe.contentWindow;
        // if (pri && content) {
        //   pri.document.open();
        //   pri.document.write(content.innerHTML);
        //   pri.document.close();
        //   pri.focus();
        //   pri.print();
        // }

        // document.body.removeChild(iframe);


        onClick={ConvertToPDF}
        style={{ width: '200px', fontSize: 14, fontWeight: 'bold', color: 'white' }}
        variant="primary">PRINT SCORE CARD</Button> */}
      <ComponentToPrint />
    </div >
  );
}