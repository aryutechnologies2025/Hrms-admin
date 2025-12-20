import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Aryulogo from "../../assets/aryu_logo.png";
import Sing from "../../assets/sign.png";
import Steal from "../../assets/steal.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import NumberFormat from "../../utils/NumberFormat";
import Swal from "sweetalert2";



const Invoice = () => {
  const invoiceRef = useRef();

  const location = useLocation();
  const { invoiceId } = location.state || {};

  // console.log("invoiceId in Sales_invoice:", invoiceId);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails(invoiceId);
    }
  }, [invoiceId]);

  const [allinvoiceDetails, setAllinvoiceDetails] = useState([]);
  const [settingData, setSettingData] = useState([]);

  // console.log("allinvoiceDetails", allinvoiceDetails);
  // console.log("settingData", settingData);
  const [errors, setErrors] = useState("");

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/invoice/client-invoice`,
        {
          params: { id: invoiceId },
        },
        { withCredentials: true }
      );
      // console.log(response);

      setAllinvoiceDetails(response.data?.data);
      setSettingData(response.data?.setting);



    } catch (err) {
      console.log("error")
      // setErrors("Failed to fetch roles.");
    }
  };


  const invoiceAddress = settingData?.invoiceAddress || "";

  const parts = invoiceAddress.split(", ");

  const line1 = parts.slice(0, 4).join(", ");
  const line2 = parts.slice(4).join(", ");

  // console.log("line1", line1);
  // console.log("line2", line2);

  const [totalAmount, setTotalAmount] = useState(0);

  // console.log("totalAmount", totalAmount)


  useEffect(() => {
    const total =
      allinvoiceDetails?.items?.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ) || 0;

    setTotalAmount(total);
  }, [allinvoiceDetails?.items]);

  // console.log("totalAmount", totalAmount);





  // const downloadPDF = async () => {
  //   const element = invoiceRef.current;

  //   // Capture element
  //   const canvas = await html2canvas(element, { scale: 1.5 });
  //   const imgData = canvas.toDataURL("image/jpeg", 0.7);

  //   // Create PDF
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  //   pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);

  //   // Unique filename (timestamp-based)
  //   const fileName = `invoice_${new Date().getTime()}.pdf`;
  //   pdf.save(fileName);
  // };
  const [isGenerating, setIsGenerating] = useState(false);

    const downloadPDF = async () => {

    setIsGenerating(true);

    Swal.fire({
      title: "Generating Invoice",
      text: "Please wait while we generate your invoice...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const element = invoiceRef.current;

      const canvas = await html2canvas(element, { scale: 1.5 });
      const imgData = canvas.toDataURL("image/jpeg", 0.7);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);

      const invoiceNumber =
        allinvoiceDetails?.invoice_number || `invoice_${Date.now()}`;

      const pdfBlob = pdf.output("blob");


      const formData = new FormData();
      formData.append("clientInvoice", pdfBlob, `${invoiceNumber}.pdf`);
      formData.append("id", invoiceId);
      formData.append("invoice_document_type", "Tax Invoice");


     
        const response = await axios.post(
          `${API_URL}/api/invoice/upload-client-invoice`,
          formData,
          { withCredentials: true }, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
        );
  console.log("PDF uploaded successfully:", response.data);

    Swal.fire({
      icon: "success",
      title: "Invoice Generated",
      text: "Invoice has been generated and uploaded successfully.",
      confirmButtonColor: "#2563eb",
    });

    // Optional local download
    // pdf.save(`${invoiceNumber}.pdf`);

  } catch (error) {
    console.error("Invoice generation failed:", error);

    Swal.fire({
      icon: "error",
      title: "Generation Failed",
      text: "Something went wrong while generating invoice.",
    });
  } finally {
    setIsGenerating(false);
  }
};




  const amountInWords = (num) => {
    if (!num) return "Zero Rupees Only";

    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six",
      "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
      "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];

    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convert = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
      if (n < 100000)
        return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
      if (n < 10000000)
        return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
      return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    };

    return convert(num) + " Rupees Only";
  };


  // gst calucateion


  const totalCgstAmount =
    allinvoiceDetails?.items?.reduce((sum, item) => {
      const amount = Number(item.amount || 0);
      const cgstPercent = Number(settingData?.cgst || 0);

      const cgst =
        (amount * cgstPercent) / (100);

      return sum + cgst;
    }, 0) || 0;


  const totalSgstAmount =
    allinvoiceDetails?.items?.reduce((sum, item) => {
      const amount = Number(item.amount || 0);
      const sgstPercent = Number(settingData?.sgst || 0);

      const sgst =
        (amount * sgstPercent) / (100);

      return sum + sgst;
    }, 0) || 0;


  const grandTotalTax = totalCgstAmount + totalSgstAmount;



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
        <div className="flex justify-between pb-2 h-full border-black items-start border-b-2 border-r-2 border-l-2">
          <div className=" border-black w-[50%] border-r-2 ">
            <div className="border-b-2   border-black px-[5%]">
              <img src={Aryulogo} alt="Company Logo" className="h-18 mb-2" />
            </div>
            <div className="p-1  text-[13px]   border-black">
              <p>{line1}</p>
              <p className="pt-1">{line2}</p>
              <p className="pt-2">State Name - {settingData?.invoiceState}, Code - 33</p>
              <p className="pt-2">
                <strong>GSTIN/UIN</strong>: 33AAPCA1407R1ZE
              </p>
              <p className="pt-2">
                <strong>Email</strong>- {settingData?.invoiceEmail}/{" "}
                <strong>PH</strong> - {settingData?.invoicePhone}
              </p>{" "}
            </div>
          </div>
          <div className="w-[50%]   border-black">
            <div className="text-left p-1 pt-4 border-b-2  border-black">
              <div className="pt-1">
                <strong className=" w-[40%]  inline-block">Invoice No</strong>
                <strong className="font-bold">:</strong> {allinvoiceDetails?.invoice_number}
              </div>
              <div className="pt-1 pb-3">
                <strong className=" w-[40%]  inline-block">Dated</strong>
                <strong className="font-bold">:</strong> {new Date().toLocaleDateString("en-IN")}
              </div>
              {/* <div className="pt-1 pb-1">
                                      <strong className=" w-[40%]  inline-block">
                                          Place of Supply
                                      </strong>
                                      <strong className="font-bold">:</strong> within 30 days
                                  </div> */}
            </div>

            <div className="p-1 text-[12px]   border-black">
              <p className="font-bold pt-2">Buyer (Bill To)</p>
              <p className="font-bold pt-3">{allinvoiceDetails?.clientId?.client_name}</p>
              <p className="pt-1">
                {allinvoiceDetails?.clientId?.address}
              </p>
              {/* <p >
                                                   MANGAL MURTI SQUARE, Ragado Building, TRIMURTI NAGAR, NAGPUR MH
                                                   440022
                                                 </p> */}
              <p className="pt-1">
                <strong>GSTIN/UIN</strong>: {allinvoiceDetails?.clientId?.gst}
              </p>
              <p className="pt-1">
                <strong>Email</strong>- {allinvoiceDetails?.clientId?.email} / <strong>PH</strong>{" "}
                - {allinvoiceDetails?.clientId?.phone_number}
              </p>{" "}
            </div>
          </div>
        </div>
        {/* table */}

        <div className=" ">
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
              {allinvoiceDetails?.items?.map((item, index) => (
                <tr key={index} className="">
                  <td className="no-line-bot p-1 border-r-2 border-l-2  align-middle border-black">
                    {index + 1}
                  </td>
                  <td className="no-line-bot p-1 border-r-2  align-middle  border-black text-left">
                    {item.description} <br />
                    <a
                      href={item.link}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.link}
                    </a>
                  </td>
                  <td className="no-line-bot p-1 border-r-2 align-middle   border-black">
                    {item.code || "998314"}
                  </td>
                  <td className="no-line-bot p-1 border-r-2  align-middle  border-black">
                    {item.quantity}
                  </td>
                  <td className="no-line-bot p-1 border-r-2 align-middle   border-black">
                    {item.rate}
                  </td>
                  <td className="no-line-bot p-1 border-r-2  align-middle  border-black">
                    Nos
                  </td>
                  <td className="no-line-bot p-1 border-r-2 pb-2  align-middle border-black">
                    {NumberFormat(item.amount)}
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
                  {NumberFormat(totalAmount)}
                </td>
              </tr>
              {/* cgst */}
              <tr className="">
                <td className="no-line-bot p-1 border-r-2  border-l-2   border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Output CGST {settingData?.cgst}%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black">
                  {settingData?.cgst} %
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  {(
                    (Number(totalAmount || 0) * Number(settingData?.cgst || 0)) / 100).toFixed(2)}
                </td>
              </tr>
              {/* sgst */}
              <tr className="">
                <td className="no-line-bot p-1 border-r-2 border-l-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  Output SGST {settingData?.sgst}%
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black">
                  {settingData?.sgst} %
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  {((Number(totalAmount || 0) * Number(settingData?.sgst || 0)) / 100).toFixed(2)}
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
                  {settingData?.igst} %
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black"></td>
                <td className="no-line-bot p-1 border-r-2    border-black font-bold">
                  -
                </td>
              </tr>
              {/* value */}
              <tr className="border-t-2  border-black  ">
                <td className="no-line-bot p-1 border-r-2  border-l-2 align-middle  border-black"></td>
                <td className="no-line-bot p-2  border-r-2  align-middle  border-black text-right font-bold">
                  Invoice Value
                </td>
                <td className="no-line-bot p-1 border-r-2  align-middle  border-black"></td>
                <td className="no-line-bot p-1 border-r-2  align-middle  border-black"></td>
                <td className="no-line-bot p-1 border-r-2 align-middle   border-black"></td>
                <td className="no-line-bot p-1 border-r-2 align-middle   border-black"></td>
                <td className="no-line-bot p-1 border-r-2  align-middle  border-black font-bold">
                  ₹ {NumberFormat(allinvoiceDetails?.total_amount)}
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
            {amountInWords(allinvoiceDetails?.total_amount)}
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
            {/* <tbody className="">
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
                        </tbody> */}

            <tbody className="">
              {allinvoiceDetails?.items?.map((item, index) => (
                <tr key={index} className="">

                  <td className="no-line-bot p-1 border-r-2 border-l-2 text-center align-middle  border-black ">
                    {item.description || "998314"}
                  </td>
                  <td className="no-line-bot p-1 border-r-2 align-middle text-right   border-black">
                    {NumberFormat(item.amount)}
                  </td>
                  <td className="no-line-bot p-1 border-r-2  align-middle text-right border-black">
                    {settingData?.cgst}.00%
                  </td>
                  <td className="no-line-bot p-1 border-r-2 align-middle  text-right border-black">
                    0.00
                  </td>
                  <td className="no-line-bot p-1 border-r-2  align-middle text-right  border-black">
                    {(
                      (Number(item.amount || 0) * Number(settingData?.cgst || 0)) /
                      (100)
                    ).toFixed(2)}
                  </td>
                  <td className="no-line-bot p-1 border-r-2   align-middle text-right border-black">
                    {(
                      (Number(item.amount || 0) * Number(settingData?.sgst || 0)) /
                      (100)
                    ).toFixed(2)}
                  </td>
                  <td className="no-line-bot p-1 border-r-2   align-middle text-right border-black">
                    {NumberFormat(
                      ((Number(item.amount || 0) * Number(settingData?.cgst || 0)) /
                        (100 + Number(settingData?.cgst || 0))) +
                      ((Number(item.amount || 0) * Number(settingData?.sgst || 0)) /
                        (100 + Number(settingData?.sgst || 0)))
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-b-2  border-black text-[14px]">
              {/* taxable */}
              <tr className="border-t-2  border-black">
                <td className="no-line-bot p-1 border-r-2 border-l-2  text-center  border-black  font-bold">
                  Total
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  {NumberFormat(totalAmount)}
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  -
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  -
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  {NumberFormat(totalCgstAmount.toFixed(2))}
                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  {NumberFormat(totalSgstAmount.toFixed(2))}

                </td>
                <td className="no-line-bot p-1 border-r-2    border-black text-right font-bold">
                  {NumberFormat(grandTotalTax.toFixed(2))}

                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* .word ampount */}
        <div className=" border-r-2 border-l-2 p-1 border-black">
          <p>
            <span className="w-[30%] inline-block pb-1">Tax amount (in words)</span>
            <strong>:  {amountInWords(allinvoiceDetails?.total_amount)}
            </strong>
          </p>
          <p>
            <span className="w-[30%] inline-block pb-1">Company's PAN No</span>
            <strong>: AAPCA1407R</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="flex w-full  ">
          {/* <div className="w-[62%] border-b-2  border-l-2 border-t-2  border-black">
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
          </div> */}
          <div className="w-full  border-black">
            <div className="border-b-2  border-black border-l-2 border-r-2  border-t-2 ">
              {" "}
             <p className="   underline text-[14px]  border-black  pt-1 px-1">
                            Company's Bank Details
                        </p>
                        <div className=" border-black  p-1">
                            <p className=" text-black">
                                <span className="w-[20%] inline-block ">Ac Name</span>: {settingData?.accountName}
                            </p>
                            <p className=" text-black">
                                <span className="w-[20%] inline-block">Bank Name</span>: {settingData?.bankName}
                            </p>
                            <p className="pt-1 text-black">
                                <span className="w-[20%] inline-block">A/c No</span>: {settingData?.accountNumber}
                            </p>
                            <p className="pt-1 text-black pb-1">
                                <span className="w-[20%] inline-block">IFSC / BR</span>: {settingData?.ifscCode}
                            </p>
                        </div>
            </div>

          </div>
        </div>

        {/* footer pss */}


        <div className="flex w-full  ">
          <div className="w-full border-b-2  border-l-2   border-black">


            <div className="">
                            <p className="font-semibold border-b-2  border-black  underline text-[16px] p-1 pb-2">
                                Declaration
                            </p>
                            <p className="pt-1 p-1">
                                {settingData?.invoiceTerms}
                            </p>
                        </div>
          </div>
          <div className="w-full border-b-2 border-black">

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
      <div className="text-center mt-4 flex gap-5 justify-center">
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Generate Invoice
        </button>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Invoice;
