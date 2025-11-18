import React, { useState } from "react";
const Dummy = () => {
  const [items, setItems] = useState([
    { title: "", file: [] }
  ]);
  const handleAddItem = () => {
    setItems([...items, { title: "", file: [] }]);
  };
  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };
  const handleFileDelete = (itemIndex, fileIndex) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].file.splice(fileIndex, 1); // remove the specific file
    setItems(updatedItems);
  };
  const handleDeleteObject = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1); // remove the whole object (row)
    setItems(updatedItems);
  };
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Document {index + 1}</strong>
            <button
              onClick={() => handleDeleteObject(index)}
              style={{ background: "none", border: "none", color: "red", cursor: "pointer" }}
            >
              :x: Delete Row
            </button>
          </div>
          <input
            type="text"
            placeholder="Title"
            value={item.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            style={{ marginBottom: "0.5rem", display: "block", width: "100%" }}
          />
          <input
            type="file"
            multiple
            onChange={(e) =>
              handleChange(index, "file", [
                ...item.file,
                ...Array.from(e.target.files)
              ])
            }
          />
          <div>
            <strong>Selected Files:</strong>
            <ul>
              {item.file.map((f, fileIdx) => (
                <li key={fileIdx}>
                  {f.name}
                  <button
                    style={{ marginLeft: "10px", color: "red" }}
                    onClick={() => handleFileDelete(index, fileIdx)}
                  >
                    :x: Remove File
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <button onClick={handleAddItem}>+ Add More</button>
      <h3>Final Output:</h3>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};
export default Dummy;