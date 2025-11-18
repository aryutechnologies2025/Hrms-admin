import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Aryulogo from "../assets/Aryu_logo.png";
import Sing from "../assets/sign.png";
import Steal from "../assets/steal.png";

const Invoice = () => {
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
    <div className="p-6">
      <div
        ref={invoiceRef}
        className="bg-white   max-w-4xl mx-auto text-xs leading-tight p-6"
      >
        {/* Header */}
        <div className="border-b-2 border-l-2 border-r-2 border-black  border-t-2 flex justify-center text-[14px] text-black font-semibold p-1 uppercase">
          Tax Invoice
        </div>
        <div className="flex justify-between  border-black items-start border-b-2 border-r-2 border-l-2">
          <div className="border-r-2 border-black w-[50%]">
            <div className="border-b-2   border-black px-[5%]">
              <img src={Aryulogo} alt="Company Logo" className="h-18 mb-2" />
            </div>
            <div className="p-1  text-[13px]   border-black">
              <p>No 33/14, Ground floor, Jayammal St, Ayyavoo Colony,</p>
              <p className="pt-1">Aminjikarai, Chennai, Tamil Nadu 600029</p>
              <p className="pt-2">State Name - Tamil Nadu, Code - 33</p>
              <p className="pt-2">
                <strong>GSTIN/UIN</strong>: 33AAPCA1407R1ZE
              </p>
              <p className="pt-1">
                <strong>Email</strong>- aruna@aryuenterprises.com /{" "}
                <strong>PH</strong> - 7502149013
              </p>{" "}
            </div>
          </div>
          <div className="w-[50%]  border-black">
            <div className="text-left p-1 pt-4 border-b-2  border-black">
              <div className="pt-1">
                <strong className=" w-[40%]  inline-block">Invoice No</strong>
                <strong className="font-bold">:</strong> AY250608
              </div>
              <div className="pt-1">
                <strong className=" w-[40%]  inline-block">Dated</strong>
                <strong className="font-bold">:</strong> 30-06-2025
              </div>
              <div className="pt-1">
                <strong className=" w-[40%]  inline-block">
                  Place of Supply
                </strong>
                <strong className="font-bold">:</strong> within 30 days
              </div>
            </div>

            <div className="p-1 text-[12px]   border-black">
              <p className="font-bold pt-2">Buyer (Bill To)</p>
              <p className="font-bold pt-3">OCCD PRIVATE LIMITED</p>
              <p className="pt-1">
                T-4, GOKUL UDDHAV APARTMENT, Midori ku, Tokaichibacho 838-4
              </p>
              <p>
                MANGAL MURTI SQUARE, Ragado Building, TRIMURTI NAGAR, NAGPUR MH
                440022
              </p>
              <p className="pt-1">
                <strong>GSTIN/UIN</strong>: 27AACCO7458F1Z8
              </p>
              <p className="pt-1">
                <strong>Email</strong>- occd@gmail.com.com / <strong>PH</strong>{" "}
                - 7502149013
              </p>{" "}
            </div>
          </div>
        </div>
        {/* table */}

        <div className="">
          {" "}
          <table className="w-full   text-center ">
            <thead className="border-black">
              <tr>
                <th className=" border-r-2 border-l-2 border-b-2 w-[3%]  p-1 border-black">
                  Sl No
                </th>
                <th className=" border-r-2  border-b-2  w-[38%] p-1 border-black">
                  Description of Service
                </th>
                <th className=" border-r-2  border-b-2 w-[9%] p-1 border-black">
                  HSN/SAC
                </th>
                <th className=" border-r-2  border-b-2  p-1 border-black">
                  Quantity
                </th>
                <th className=" border-r-2  border-b-2  p-1 border-black">
                  Rate
                </th>
                <th className=" border-r-2 border-b-2   p-1 border-black">
                  Per
                </th>
                <th className=" border-r-2 border-b-2  p-1 border-black">
                  Amount
                </th>
              </tr>
            </thead>    
            <tbody className="">
              {data.map((item, index) => (
                <tr key={index} className="">
                  <td className="no-line-bot p-1 border-r-2 border-l-2   border-black">
                    {index + 1}
                  </td>
                  <td className="no-line-bot p-1 border-r-2    border-black text-left">
                    {item.title} <br />
                    <a
                      href={item.link}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.link}
                    </a>
                  </td>
                  <td className="no-line-bot p-1 border-r-2    border-black">
                    {item.code}
                  </td>
                  <td className="no-line-bot p-1 border-r-2    border-black">
                    {item.qty}
                  </td>
                  <td className="no-line-bot p-1 border-r-2    border-black">
                    {item.rate}
                  </td>
                  <td className="no-line-bot p-1 border-r-2    border-black">
                    Nos
                  </td>
                  <td className="no-line-bot p-1 border-r-2    border-black">
                    ₹ {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-b-2  border-black text-[14px]">
              {/* taxable */}
              <tr className="h-[50px]  align-top">
                <td className="no-line-bot p-1 border-r-2 border-l-2   border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Taxable Value
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2  border-t-2  border-black">
                  18,000.00
                </td>
              </tr>
              {/* cgst */}
              <tr className="">
                <td className="no-line-bot p-1 border-r-2  border-l-2   border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Output CGST 9%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black">
                  9 %
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  1,620.00
                </td>
              </tr>
              {/* sgst */}
              <tr className="">
                <td className="no-line-bot p-1 border-r-2 border-l-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Output SGST 9%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black">
                  9 %
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  1,620.00
                </td>
              </tr>
              {/* 1gst */}
              <tr className="">
                <td className="no-line-bot p-1 border-r-2  border-l-2   border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Output IGST Export 0%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black">
                  0 %
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  -
                </td>
              </tr>
              {/* value */}
              <tr className="border-t-2  border-black">
                <td className="no-line-bot p-1 border-r-2  border-l-2   border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Invoice Value
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  ₹ 21,240.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in Words */}
        <div className="border-b-2 border-r-2 border-l-2 p-1 border-black">
          <p className="">Amount Chargeable (in Words)</p>
          <p className="font-semibold">
            {" "}
            Twenty-one thousand two hundred forty.
          </p>
        </div>

        {/* Tax Table */}
        <div className="">
          {" "}
          <table className="w-full   text-center ">
            <thead className="border-black">
              <tr>
                <th className=" border-r-2 border-l-2 border-b-2 w-[15%] p-1 border-black">
                  HSN/SAC
                </th>
                <th className=" border-r-2  border-b-2 w-[26%]  p-1 border-black">
                  Taxable Value
                </th>
                <th className=" border-r-2  border-b-2 w-[80px] p-1 border-black">
                  Rate of %
                </th>
                <th className=" border-r-2   border-b-2 w-[111px] p-1 border-black">
                  IGST
                </th>
                <th className=" border-r-2   border-b-2 w-[111px] p-1 border-black">
                  CGST{" "}
                </th>
                <th className=" border-r-2   border-b-2 w-[111px] p-1 border-black">
                  SGST
                </th>
                <th className=" border-r-2   border-b-2   w-[111px] p-1 border-black">
                  Total Tax amount
                </th>
              </tr>
            </thead>
            <tbody className="">
              <tr>
                <td className="no-line-bot p-1 border-r-2 border-l-2   border-black text-right">
                  998314
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right ">
                  18,000.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  9.00%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  0.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right ">
                  1620.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  1620.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  3,240.00
                </td>
              </tr>
              <tr>
                <td className="no-line-bot p-1 border-r-2 border-l-2  border-black text-right">
                  0
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right ">
                  -
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  9.00%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  0.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  0.00{" "}
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  0.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right">
                  -
                </td>
              </tr>
            </tbody>
            <tfoot className="border-b-2  border-black text-[14px]">
              {/* taxable */}
              <tr className="border-t-2  border-black">
                <td className="no-line-bot p-1 border-r-2 border-l-2   border-black text-right font-bold">
                  Total
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  18,000.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  -
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  -
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  1,620.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  1,620.00
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  3,240.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* .word ampount */}
        <div className=" border-r-2 border-l-2 p-1 border-black">
          <p>
            <span className="w-[30%] inline-block">Tax amount (in words)</span>
            <strong>: Three thousand two hundred forty rupees only.</strong>
          </p>
          <p>
            <span className="w-[30%] inline-block">Company's PAN No</span>
            <strong>: AAPCA1407R</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="flex  ">
          <div className="w-[62%] border-b-2  border-l-2 border-t-2  border-black">
            <div className="border-b-2 p-1 border-black">
              {" "}
              <p className=" font-semibold  underline text-[16px]">
                Payment Terms,
              </p>
              <p className="pt-1">50% advance before starting the project</p>
              <p className="pt-1">
                Balance 50% on completion and handover of the code
              </p>
            </div>

            <div className="">
              <p className="font-semibold border-b-2  border-black  underline text-[16px] p-1">
                Declaration
              </p>
              <p className="pt-1 p-1">
                We declare that this invoice shows the actual price of the
                service described and all particulars are true and correct.
              </p>
            </div>
          </div>
          <div className="w-[38%] border-b-2 border-black">
            <div className="border-b-2  border-black border-l-2 -mt-4 border-t-2 ">
              {" "}
              <p className="   underline text-[14px]  border-black border-r-2 pt-1 px-1">
                Company's Bank Details
              </p>
              <div className=" border-black border-r-2 p-1">
                <p className=" text-black">
                  <span className="w-[20%] inline-block">Bank Name</span>: HDFC
                  BANK Ltd
                </p>
                <p className="pt-1 text-black">
                  <span className="w-[20%] inline-block">A/c No</span>:
                  50200064135746
                </p>
                <p className="pt-1 text-black">
                  <span className="w-[20%] inline-block">IFSC / BR</span>:
                  HDFC0001861
                </p>
              </div>
            </div>
            <div className="border-x-2 border-black p-3">
              {/* Top Text */}
              <div className="text-right  text-sm">
                for ARYU ENTERPRISES PRIVATE LIMITED
              </div>

              {/* Stamp + Signature Row */}
              <div className="flex items-center justify-between ">
                {/* Stamp */}
                <img
                  src={Steal}
                  alt="Company Stamp"
                  className="h-32  object-contain"
                />

                {/* Signature */}
                <div>
                  <img
                    src={Sing}
                    alt="Authorized Signatory"
                    className="h-24 object-contain"
                  />
                  <div className="text-right  font-medium text-sm">
                    Authorized Signatory
                  </div>
                </div>
              </div>
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

export default Invoice;
