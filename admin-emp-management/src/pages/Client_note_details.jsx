import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";

import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";

import { useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";




const Client_note_details = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    console.log("desc",desc)
    const [notes, setNotes] = useState([]);

    const handleSave = () => {
        if (!title.trim() && !desc.trim()) return;

        const newNote = {
            id: Date.now(),
            title,
            desc,
        };

        setNotes([newNote, ...notes]);
        setTitle("");
        setDesc("");
        setOpen(false);
    };

    return (
        <div className="flex flex-col bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">

            {/* HEADER */}
            <div className="flex justify-between mt-4 mb-3">
                <h1 className="text-3xl font-semibold">Client Notes</h1>

                <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                    Add
                </button>
            </div>

            {/* POPUP */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10 z-50">
                    <div className="bg-white w-[90%] md:w-[500px] rounded-xl shadow-lg p-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Add Note</h2>
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        <div className="mt-4">
                            <label className="font-medium">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter title..."
                            />

                            <label className="font-medium mt-4 block">Description</label>
                 
                            <div className="w-[60%] md:w-[100%] rounded-lg">

                                <Editor
                                    style={{ height: "100px" }}
                                    id="description"
                                    name="description"
                                    text={desc}
                                    onTextChange={(e) => setDesc(e.htmlValue)}
                                    className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIST OF NOTES (like Google Keep) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {notes.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition"
                    >
                        <h3 className="font-semibold text-lg">{item.title}</h3>
 <div
        className="text-gray-700 mt-1"
        dangerouslySetInnerHTML={{ __html: item.desc }}
      ></div>                    </div>
                ))}
            </div>
        </div>
    );
};
export default Client_note_details;
