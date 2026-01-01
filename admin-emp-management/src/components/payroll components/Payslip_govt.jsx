import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Aryulogo from "../../assets/Aryu-logo1.png";
import Sing from "../../assets/sign.png";
import Steal from "../../assets/steal.png";

const Payslip_govt = () => {
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
    const fileName = `invoice_${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  };


  const data = [
    {
      title: "Bug Fixing enhancement Website",
      link: "https://mytechnicaljobs.occdesign.link/",
      code: "998314",
      qty: "1 Nos",
      rate: "18,000.00",
      total: "18,000.00",
    },
    {
      title: "E-commerce Website Development",
      link: "https://myecommerce.occdesign.link/",
      code: "998315",
      qty: "1 Nos",
      rate: "35,000.00",
      total: "35,000.00",
    },
    {
      title: "Mobile App UI Design",
      link: "https://myappui.occdesign.link/",
      code: "998316",
      qty: "1 Nos",
      rate: "25,000.00",
      total: "25,000.00",
    },
  ];

  return (
    <div>
      <div
        ref={invoiceRef}
        className="bg-white h-full max-w-3xl mx-auto text-xs leading-tight p-5"
      >
        {/* Header */}
        <div className="p-3 border border-black text-sm font-serif">
          {/* Header */}
          <div className=" mb-4">
            <div className="flex ">
              <h1 className=" font-bold text-[15px] text-center">
                படிவம் - டி ஊதியச் சீட்டு / விடுப்பு அட்டை FORM - T WAGE SLIP / LEAVE CARD
              </h1>


            </div>
            <p className="text-xs font-sans text-center pt-2 ">
              (See Sub-Rule (6) of Rule 11 of the Tamil Nadu Shops and Establishments
              Rules,1948)
            </p>
          </div>


          <div className="flex justify-end">
            <span className="font-semibold">Date :</span>
            <span className=" w-[20%] ml-2"></span>
          </div>

          {/* Top Details */}
          <div className=" mb-3">
            <div className="flex w-full">
              <span className="font-semibold ">
                1. Name and Address of the Establishment :
              </span>
              <span className="border-b border-black inline-block w-[54%] ml-2 pt-7"></span>
            </div>
            {/* <div>
          <span className="font-semibold">Date :</span>
          <span className="border-b border-black inline-block w-full ml-2"></span>
        </div> */}
          </div>

          <span className="border-b border-black inline-block w-[98%] ml-2"></span>


          <div className="space-y-2 mb-4">
            <div className="flex w-full">
              <span className="font-semibold ">2. Name of the Person employed :</span>
              <span className="border-b border-black inline-block w-[64%] ml-2 pt-7"></span>
            </div>

            <div className="flex w-full">
              <div className="flex w-[60%]">
                <span className="font-semibold ">3. Father’s/Husband’s Name :</span>
                <span className="border-b border-black inline-block w-[45%] ml-2 pt-7"></span>
              </div>
              <div className="flex  w-[40%]">
                <span className="font-semibold">4. Designation :</span>
                <span className="border-b border-black inline-block w-[56%] ml-2 pt-7"></span>
              </div>
            </div>

            <div className="flex w-full">
              <div className="flex w-[50%]">
                <span className="font-semibold">5. Date of Entry into Service :</span>
                <span className="border-b border-black inline-block w-[37%] ml-2 pt-7"></span>
              </div>
              <div className="flex  w-[50%]">
                <span className="font-semibold">6. Wage Period :</span>
                <span className="ml-2">From</span>
                <span className="border-b border-black inline-block w-[23%] mx-1 pt-7"></span>
                <span>To</span>
                <span className="border-b border-black inline-block w-[23%] ml-1 pt-7"></span>
              </div>
            </div>
          </div>

          {/* Wage Table */}
          <div className="flex gap-2 text-sm font-serif">

            {/* LEFT SIDE */}
            <div>


              <div className="flex">
                {/* LABELS – OUTSIDE */}
                <div className="flex justify-end  pr-2 pt-0 w-full ">
                  <div className="flex-1 space-y-[5px]">
                    <p className="font-bold ">7. Wages Earned :</p>
                    <p className="text-end">(a) Basic :</p>
                    <p className="text-end">(b) D.A. :</p>
                    <p className="text-end">(c) H.R.A. :</p>
                    <p className="text-end">(d) O.T. Wages :</p>
                    <p className="text-end">(e) Leave Wages :</p>
                    <p className="text-end">(f) Other Allowances :</p>
                    <p className="font-semibold text-end">(g) Gross Wages :</p>
                  </div>
                </div>

                {/* RS / P TABLE */}
                <div className="border border-black">
                  <div className="flex border-b border-black text-center font-bold">
                    <div className="w-20 border-r border-black pb-2">Rs.</div>
                    <div className="w-12">P.</div>
                  </div>

                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex border-b border-black last:border-b-0">
                      <div className="w-20 border-r border-black h-6"></div>
                      <div className="w-12 h-6"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>


              <div className="flex">
                {/* LABELS – OUTSIDE */}
                <div className="flex justify-end  pr-2 pt-0 w-full">
                  <div className="flex-1 space-y-[5px] mt-9">
                    <p className="font-bold text-end">Deductions :</p>

                    <p className="text-end">(i) E.P.F. :</p>
                    <p className="text-end">(ii) E.S.I. :</p>
                    <p className="text-end">(iii) Other Deductions :</p>
                    <p className="font-semibold text-end">TOTAL Deductions :</p>
                  </div>
                </div>

                {/* RS / P TABLE */}

                <div className="mt-1">
                  <p className="font-bold ">(g)Gross Wages :</p>
                  <div className="border border-black mt-2">
                    <div className="flex border-b border-black text-center  font-bold">
                      <div className="w-20 border-r border-black pb-2">Rs.</div>
                      <div className="w-12">P.</div>
                    </div>

                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex border-b border-black last:border-b-0">
                        <div className="w-20 border-r border-black h-6"></div>
                        <div className="w-12 h-6"></div>
                      </div>
                    ))}
                  </div>

                  <p className="font-semibold  pt-2 ">Net Amount Paid</p>

                </div>

                {/* table */}
                <div className="border border-black w-fit font-serif text-sm">

                  {/* HEADER */}
                  <div className="flex border-b border-black text-center font-bold">
                    <div className="w-20 border-r border-black pb-1">Rs.</div>
                    <div className="w-12 pb-1">P.</div>
                  </div>

                  {/* BODY (FULL HEIGHT WITH DIVIDER) */}
                  <div className="flex ">
                    <div className="w-20 h-[135px] border-r border-black"></div>
                    <div className="w-12 h-[135px]"></div>
                  </div>

                  {/* BOTTOM LINE (as in image) */}
                  <div className="flex border-t border-black">
                    <div className="w-20 border-r border-black h-8"></div>
                    <div className="w-12 h-8"></div>
                  </div>

                </div>

              </div>
            </div>

          </div>


          {/* Leave Section */}
          <div className="space-y-2 mb-6 mt-6">
            <div className="w-full flex">
              <span className="font-semibold w-[38%]">
                8. Leave Availed during the month :
              </span>
              <div>
                <span className="ml-2 ">CL :</span>
                <span className="border-b   border-black w-10 inline-block mx-1"></span>
                <span>SL :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
                <span>EL :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
                <span>ML :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
              </div>
            </div>

            <div className="w-full flex">
              <span className="font-semibold w-[38%]">9. Leave at Credit :</span>
              <div>
                <span className="ml-2">CL :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
                <span>SL :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
                <span>EL :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
                <span>ML :</span>
                <span className="border-b border-black w-10 inline-block mx-1"></span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-10 mt-8 text-xs pt-5">
            <div className="flex justify-start">
           <p className="pt-1 text-center">
  Signature of Employer / Manager <br />
  or any other Authorised Person
</p>

            </div>
            <div className="flex justify-end">
              <p className=" pt-1 text-center">
                Signature or Thumb Impression of the <br />
                Person Employed
              </p>
            </div>
          </div>
        </div>

      </div>


      {/* Download Button */}
      <div className="text-center mt-4">
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Payslip_govt;
