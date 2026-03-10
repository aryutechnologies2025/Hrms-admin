import React, { useState } from 'react'
import Loader from '../Loader';
import Mobile_Sidebar from '../Mobile_Sidebar';
import Footer from '../Footer';

const Social_ContentMaster_Details = () => {

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

                            <p className="text-sm text-blue-500">Content Master</p>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-between mt-1 md:mt-4">
                            <div className="">
                                <h1 className="text-2xl md:text-3xl font-semibold">Content Master</h1>
                            </div>


                        </div>

                        <div className=' bg-white rounded-2xl px-2 py-2 md:px-5 md:py-5 flex flex-col justify-between mt-1 '>
                            <span>1. Add text , show as list , show in calender , show as tasks (todo, in progress, blocked, inreview,done) , all option we need to show the task of the day and add files and comments by each department people , final verification , till deployment that means posting in social media will be covered in this module.*</span>
                            <span>2. Task creation , completion of work , like design , content will be a seperate flag and approval from client need a status or a flag , final completion is posted on social media , these tasks will include the reaches , likes , comments to measure the post quality and content quality, and for every interval organic growth.*</span>
                            <span>3. First phase , one liner topics selection  and approval from client, second phase of content creation and approval from cilent, third phase creating digital assets for the content getting approval,  fourth phase is scheduling before the date , fifth phase is posting and sixth phase is tracking for future statistics.*</span>
                        </div>

                        <div>

                        </div>


                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}

export default Social_ContentMaster_Details
