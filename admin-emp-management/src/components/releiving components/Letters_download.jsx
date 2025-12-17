import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Aryulogo from "../../assets/aryudec.png";
import Sing from "../../assets/sign.png";
import Steal from "../../assets/steal.png";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import head1 from "../../assets/head1.png";
import head2 from "../../assets/head2.png";
import aryuhead from "../../assets/aryuhead.svg";
import aryufoot from "../../assets/aryufoot.svg";

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";

const Letters_download = ({ letterTitle, employeeId ,onReady}) => {
  const invoiceRef = useRef();
  const [allletter, setAllletter] = useState([]);
  // console.log("allletter",allletter);
  const [title, setTitle] = useState([]);
  const [details, setDetails] = useState([]);
  //   console.log("details", details);
  const [errors, setErrors] = useState(null);

  // Fetch letter from API
  const fetchletter = async (employeeId, letterTitle) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/letter/particular-letter-template/${employeeId}`,
        {
          params: { id: letterTitle },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setAllletter(response.data.data);
        setTitle(response.data?.title);
        setDetails(response?.data?.employee?.EMP_NAME);
        if (onReady) onReady();
      } else {
        setErrors("Failed to fetch letters.");
      }
    } catch (err) {
      console.error(err);
      setErrors("Failed to fetch letters.");
    }
  };

    useEffect(() => {
    if (employeeId && letterTitle) {
      fetchletter(employeeId, letterTitle);
    }
  }, [employeeId, letterTitle]);

  // useEffect(() => {
  //   if (employeeId && letterTitle) {
  //     fetchletter(employeeId, letterTitle);
  //   }
  // }, [employeeId, letterTitle]);

  // Download PDF once letter is loaded
  useEffect(() => {
    if (allletter.length || typeof allletter === "string") {
      downloadPDF();
    }
  }, [allletter]);

  const downloadPDF = async () => {
    // if (!invoiceRef.current) return;

    const element = invoiceRef.current;

    // Capture element at 1:1 scale for smaller file size
    const canvas = await html2canvas(element, { scale: 1, logging: false });
    const imgData = canvas.toDataURL("image/jpeg", 0.7);

    // Use element size for PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [element.offsetWidth, element.offsetHeight],
    });

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      element.offsetWidth,
      element.offsetHeight
    );

    // Save PDF with timestamp
    // pdf.save(`${details}-${title}.pdf`);
  };

  return (
    <div className="flex justify-center p-4 bg-gray-100 min-h-screen">
      {errors && <p className="text-red-500">{errors}</p>}

      <div
        ref={invoiceRef}
        className="relative bg-white flex flex-col justify-between w-[794px] h-[1123px] text-sm leading-relaxed border"
      >
        {/* Header Images */}
        <div>
          <img src={head1} alt="Head1" />
          <div className="p-8">
            <img src={aryuhead} alt="Aryu Head" />
            <h2 className="text-center font-bold mb-6 text-base mt-12">
              {title}{" "}
            </h2>

            <div className="mt-10 pt-5">
              <div className="whitespace-pre-line">
                {Array.isArray(allletter)
                  ? allletter.map((item, i) => (
                      <p key={i}>{item.content || item}</p>
                    ))
                  : allletter}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Images */}
        <div className="w-full">
          <img src={aryufoot} alt="Aryu Foot" className="w-full p-8 pb-2" />
          <img src={head2} alt="Head2" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Letters_download;
