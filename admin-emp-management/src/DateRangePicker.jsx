import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";

export default function DateRangePicker({
  fromDate,
  toDate,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  /* 🔹 Close on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyPreset = (type) => {
    let start, end;

    switch (type) {
      case "last31":
        start = dayjs().subtract(31, "day");
        end = dayjs();
        break;

      case "currentMonth":
        start = dayjs().startOf("month");
        end = dayjs();
        break;

      case "previousMonth":
        start = dayjs().subtract(1, "month").startOf("month");
        end = dayjs().subtract(1, "month").endOf("month");
        break;

      default:
        return;
    }

    onChange({
      fromDate: start.format("YYYY-MM-DD"),
      toDate: end.format("YYYY-MM-DD"),
    });

    setOpen(false);
  };

  return (
    <div ref={pickerRef} className="relative w-64">
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between border rounded-md px-3 py-2 text-sm cursor-pointer bg-white"
      >
        <span>
          {dayjs(fromDate).format("MMM D, YYYY")} –{" "}
          {dayjs(toDate).format("MMM D, YYYY")}
        </span>
        📅
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-3">
          {/* Presets */}
          <div className="space-y-1 text-sm">
            <Preset label="Last 31 days" onClick={() => applyPreset("last31")} />
            <Preset label="Current month" onClick={() => applyPreset("currentMonth")} />
            <Preset label="Previous month" onClick={() => applyPreset("previousMonth")} />
          </div>

          {/* Custom Range */}
          <div className="mt-3 border-t pt-3 flex gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                onChange({ fromDate: e.target.value, toDate })
              }
              className="border rounded px-2 py-1 text-sm w-full"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                onChange({ fromDate, toDate: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm w-full"
            />
          </div>

          <button
            className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded text-sm"
            onClick={() => setOpen(false)}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

/* Helper */
function Preset({ label, onClick }) {
  return (
    <button
      className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
