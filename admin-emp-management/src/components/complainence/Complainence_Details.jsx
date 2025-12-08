import React, { useState } from 'react'
import Loader from '../Loader';
import Footer from '../Footer';
import Mobile_Sidebar from '../Mobile_Sidebar';

const Complainence_Details = () => {
  
  const [loading, setLoading] = useState();

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
      {loading ? (
              <Loader />
            ) : (
              <>
      <div>
        

        <div className="">
          <Mobile_Sidebar />
          
        </div>
        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Complainence</p>
          </div>

        {/* Add Button */}
        <div className="flex justify-between mt-1 md:mt-4">
          <div className="">
            <h1 className="text-2xl md:text-3xl font-semibold">Complainence</h1>
          </div>

          {/* <button
            // onClick={openAddModal}
            className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button> */}
        </div>

        <div className='bg-white rounded-2xl px-2 py-2 md:px-5 md:py-5 flex justify-between mt-1 '>
        <p>This module was create for complainence note*</p>
        </div>

        <div>

        </div>

        
      </div>
      </>
            )}

      <Footer />
    </div>
  );
};
export default Complainence_Details;