import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Aryulogo from "../assets/aryudec.png";
import Sing from "../assets/sign.png";
import Steal from "../assets/steal.png";
import { useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/StringCaps";
import head1 from "../assets/head1.png";
import head2 from "../assets/head2.png";
import aryuhead from "../assets/aryuhead.svg";
import aryufoot from "../assets/aryufoot.svg";

const Declaration_pdf = ({ row, download }) => {
  //      const { state } = useLocation();
  //   const row = state?.row;
  console.log("download :", download);
  console.log("row :", row);

  const invoiceRef = useRef();

  const downloadPDF = async () => {
    const element = invoiceRef.current;

    // Capture element
    const canvas = await html2canvas(element, { scale: 1.5 });
    const imgData = canvas.toDataURL("image/jpeg", 0.7);

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);

    // Unique filename (timestamp-based)
    const fileName = `Declaration_${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  };

  useEffect(() => {
    if (download) {
      console.log("Triggering PDF download", download);
      downloadPDF();
    }
  }, [download]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="">
      <div
        ref={invoiceRef}
        className="relative bg-white mx-auto flex flex-col justify-between
             w-[794px] h-[1123px] text-sm leading-relaxed border "
      >
       <div> <img src={head1} />
        <div className="p-8">
          <img src={aryuhead} className="" />
         

          <h2 className="text-center font-bold mb-6 text-base mt-12">
            Declaration Form for Document Submission
          </h2>

          <div className="space-y-2 mb-6">
            <div className="flex ">
              <span className="w-32">Name </span>
              <span>: {row?.employeeName}</span>
            </div>
            <div className="flex ">
              <span className="w-32">Designation :</span>
              <span>: {row?.designation}</span>
            </div>
            <div className="flex ">
              <span className="w-32">Employee ID :</span>
              <span>: {row?.employeeId}</span>
            </div>
          </div>

          {/* Declaration Text */}
          <div className="space-y-4">
            <p>
              I, {row?.employeeName} hereby declare that I am submitting the
              following documents:
            </p>
            <p className="pl-8">
              [List of Documents Being Submitted] <br /><b> 1.
               {capitalizeFirstLetter(row?.certificateName)}</b>
            </p>
            <p>
              I understand that the submission of these documents is necessary
              for job application.
            </p>
            <p>
              I acknowledge and agree that upon completion of my notice period,
              the submitted documents will be returned to me.
            </p>
            <p>
              I further understand and agree that I am obligated to properly
              relieve myself from any current obligations, including serving the
              notice period as required by my current employer or organization.
            </p>
            <p>
              I affirm that the information provided in these documents is true,
              accurate, and complete to the best of my knowledge.
            </p>
            <p>
              I understand that any misrepresentation or falsification of
              information may result in the rejection of my application or
              further legal consequences.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 space-y-4">
            <p>Date: {formatDate(currentDateTime)}</p>
            <p>Time: {currentDateTime.toLocaleTimeString()}</p>
            <p>Signature : _______________________________</p>
          </div>
        </div></div>

        <div className="w-full">
          <img src={aryufoot} className="w-full p-8 pb-2" />
          <img src={head2} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Declaration_pdf;
