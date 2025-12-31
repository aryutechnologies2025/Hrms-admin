import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Aryulogo from "../../assets/Aryu-logo1.png";
import Sing from "../../assets/sign.png";
import Steal from "../../assets/steal.png";

const PayslipContent = () => {
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

        <div className="flex justify-between border-black items-start border-t-2 border-b-2 border-r-2 border-l-2">
          <div className="flex w-full gap-3">
            <div className="w-[22%] ">
              <img src={Aryulogo} alt="Company Logo" className=" pt-2 " />
            </div>
            <div className="w-[80%] leading-5 pb-2 ">
              <p className="font-bold text-2xl mt-3 ">ARYU ENTERPRISES PRIVATE LIMITED</p>
              <p className="mt-5">No 33/ 14, Jayammal St, Ayyavoo Colony, Aminjikarai, Chennai, Tamil Nadu 600029</p>
              <p className=""><span className="font-bold">Mob</span> - 9994715106 <span className="font-bold">/ Mail</span> - yuvaraj@aryuenterprises.com <span className="font-bold">/ web</span> - <a href="https://aryuenterprises.com/" target="_blank">
                https://aryuenterprises.com/
              </a>
              </p>
            </div>
          </div>
        </div>
        {/* payslip*/}
        <div className="w-full flex justify-center border-black bg-[#d9e1f2] border-l-2 border-r-2 ">
          <div className="font-bold pt-0 py-2 text-center ">PAYSLIP - JUL 2025</div>
        </div>
        {/* table 1 */}
        <div className="px-2 p-3 flex justify-between border-black border-l-2 border-r-2 border border-t-2">
          <div className="flex w-[50%]">
            <div className="items-start w-full font-bold leading-6">
              <p>Employee ID</p>
              <p>Employee Name</p>
              <p>Designation</p>
              <p>Department</p>
              <p>Date of Joining</p>
              <p>Pay Period</p>
            </div>
            <div className="mr-10 w-full leading-6">
              <p>:AYE080239</p>
              <p>:VIGNESH</p>
              <p>:Wordpress Developer</p>
              <p>:Project</p>
              <p>:08-Feb-2024</p>
              <p>:Jul-2025</p>
            </div>
          </div>
          <div className="w-[50%] flex">
            <div className="items-start w-full font-bold leading-6">
              <p>UAN</p>
              <p>IP Number</p>
              <p>Bank</p>
              <p>Account No</p>
              <p>IPSC</p>
              <p>Paid Date</p>
            </div>
            <div className="w-full leading-6">
              <p>:102136889824</p>
              <p>:NA</p>
              <p>:HDFC Bank</p>
              <p>:50100702576515</p>
              <p>:HDFC0001861</p>
              <p>:12-Aug-2025</p>
            </div>
          </div>
        </div>
        {/* table */}
        <div className="items-start w-full flex leading-5">
          <div className="flex w-[50%]  ">
            <div className="w-full border-black border border-r  border-t border-l-2 ">
              <div className="p-1 border-b border-black text-left payslip-table">Gross Salary</div>
              <div className="p-1 border-b border-black text-left payslip-table">Total Working Days</div>
              <div className="p-1 border-b border-black text-left payslip-table">Casual Leave </div>
            </div>
            <div className="w-full border-black border border-r-2 border-l-0 border-t  ">
              <div className="p-1 border-b border-black text-center payslip-table">₹9153</div>
              <div className="p-1 border-b border-black text-center payslip-table" >25</div>
              <div className="p-1 border-b border-black text-center payslip-table" >₹0</div>
            </div>
          </div>
          <div className="flex w-[50%] text-black ">
            <div className="w-full border-black border border-r border-l-0 border-t ">
              <div className="p-1 border-b border-black text-left payslip-table">Standard CTC </div>
              <div className="p-1 border-b border-black text-left payslip-table">Leaves Taken</div>
              <div className="p-1 border-b border-black text-left payslip-table">Paid Days</div>
            </div>
            <div className="w-full border-black border border-t border-l-0 border-r-2 border-b-2 ">
              <div className="p-1 border-b border-black text-center payslip-table">0</div>
              <div className="p-1 border-b border-black text-center payslip-table">25</div>
              <div className="p-1 borber-b border-black text-center payslip-table">₹10000</div>
            </div>
          </div>
        </div>
        {/* empty */}
        <div className="flex w-full h-7">
          <div className="flex w-[50%]  ">
            <div className="w-full border-black  border-l-2 border-t-0 border-b  ">
              <div className="p-1 "></div>
            </div>
            <div className="w-full border-black border-b ">
              <div className="p-1"></div>
            </div>
          </div>

          <div className="flex w-[50%]  ">
            <div className="w-full border-black border-b ">
              <div className="p-1"></div>
            </div>
            <div className="w-full border-black border-r-2 border-b ">
              <div className="p-1"></div>
            </div>
          </div>
        </div>

        {/* table 3 */}
        <table className="w-full  border-collapse leading-6 border-l-2 border-r-2  border-black">
          <thead className="table-fixed  ">
            <tr className="border-black  ">
              <th colSpan={2} className="w-[50%]   text-center font-bold payslip-th border-black border bg-[#d9e1f2]">Earnings</th>
              <th colSpan={2} className="w-[50%] bg-[#d9e1f2] text-center font-bold payslip-th border-black border border-l-2 ">Deductions</th>
            </tr>
          </thead>
          <tbody className="border-black table-fixed  border-b-2 border-t-2  ">
            <tr className="payslip-table">
              <td className="border-black p-1 border text-left w-[25%] payslip-table">Basic</td>
              <td className="border-black p-1 border payslip-table ">₹4577</td>
              <td className="border-black p-1 border border-l-2 text-left w-[25%] payslip-table">EE EPF</td>
              <td className="border-black p-1 border payslip-table">₹549</td>
            </tr>
            <tr>
              <td className="border-black p-1 border text-left  payslip-table">HRA</td>
              <td className="border-black p-1 border payslip-table">₹ 1,830.66</td>
              <td className="border-black p-1 border-l-2 text-left payslip-table">EE ESI</td>
              <td className="border-black p-1 border border-r-2 payslip-table">₹75</td>
            </tr>
            <tr>
              <td className="border-black p-1 border text-left payslip-table">Conveyance Allowance</td>
              <td className="border-black p-1 border payslip-table">₹1600</td>
              <td className="border-black p-1 border-l-2 text-left payslip-table">Professional Tax</td>
              <td className="border-black p-1 border border-r-2 payslip-table">₹155</td>
            </tr>
            <tr>
              <td className="border-black p-1 border text-left payslip-table">Medical Allowance</td>
              <td className="border-black p-1 border payslip-table">₹1250</td>
              <td className="border-black p-1 border-l-2 text-left payslip-table">TDS </td>
              <td className="border-black p-1 border border-r-2 payslip-table">₹0</td>
            </tr>
            <tr>
              <td className="border-black p-1 border text-left payslip-table">Other Allowances</td>
              <td className="border-black p-1 border payslip-table">-₹ 104.00</td>
              <td className="border-black p-1 border-l-2 text-left payslip-table">Advance</td>
              <td className="border-black p-1 border border-r-2 payslip-table">₹0</td>
            </tr>
            <tr>
              <td className="border-black p-1 border-t-2 border-b-2 payslip-th font-bold text-left payslip-table">Gross Earnings</td>
              <td className="border-black p-1 border border-t-2 payslip-th border-b-2 font-bold payslip-table">₹9153</td>
              <td className="border-black p-1 border-l-2 payslip-table"></td>
              <td className="border-black p-1 border border-r-2 payslip-table"></td>
            </tr>
            <tr>
              <td className="border-black p-1 border text-left payslip-table">ER EPF</td>
              <td className="border-black p-1 border payslip-table">₹549</td>
              <td className="border-black p-1 border-l-2 payslip-table"></td>
              <td className="border-black p-1 border border-r-2 payslip-table"></td>
            </tr>
            <tr>
              <td className="border-black p-1 border text-left payslip-table">ER ESI</td>
              <td className="border-black p-1 border payslip-table">₹ 297.48</td>
              <td className="border-black p-1 border-l-2 payslip-table"></td>
              <td className="border-black p-1 border border-r-2 payslip-table"></td>
            </tr>
            <tr className="bg-[#d9e1f2]">
              <td className="border-black p-1 border-t-2 border-b-2 font-bold payslip-th text-left payslip-table">Actual CTC</td>
              <td className="border-black p-1  border-t-2 border-b-2 border payslip-th font-bold payslip-table">₹10000</td>
              <td className="border-black p-1 border-l-2 border-t-2 border-b-2 font-bold payslip-th text-left payslip-table">Total Deductions</td>
              <td className="border-black p-1 border-t-2 border-b-2 border font-bold payslip-th  payslip-table">₹779</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end border border-r-0 border-t-0 border-black bg-[#d9e1f2] ">
          <div className="border-black p-1 payslip-table pb-2">(Take-home pay) <span className="font-bold payslip-th ">Net Salary</span></div>
          <div className="border-black w-[25.2%] text-center border-l p-1 font-bold border-r-2 payslip-th ">₹8374</div>
        </div>
        {/* table 4 */}
        <table className="w-full border-collapse leading-5">
          <tbody className="border bg-[#d9e1f2]">
            <tr>
              <td className="border-black p-1  border-l-2 text-left w-[25%] payslip-table pb-2">Amount In words </td>
              <td col-span={2} className="border-black p-1 border payslip-th border-t-0 border-r-2 text-left font-bold ">Eight thousand Three Hundred Eighty Rupees Only</td>
            </tr>
          </tbody>
        </table>
        {/* sign */}
        <div className="border-l-2 border-r-2 border-b-2 border border-black p-3">
          {/* Top Text */}
          <div className="text-right text-sm">
            for ARYU ENTERPRISES PRIVATE LIMITED
          </div>

          {/* Stamp + Signature Row */}
          <div className="flex items-center justify-end ">
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

export default PayslipContent;
