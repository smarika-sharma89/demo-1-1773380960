import { useState } from "react";

const APPROVERS = ["Sarah Mitchell", "James Okafor", "Linda Tran", "David Kowalski"];

const APPROVAL_PHASES = [
  "All Phases",
  "Awaiting Approval",
  "Awaiting Second Approval",
  "Awaiting Final Approval",
  "Fully Approved",
];

const MOCK_BILLS = [
  {
    id: "BILL-001",
    vendor: "Apex Earthworks Pty Ltd",
    amount: 14520.0,
    gst: 1320.0,
    phase: "Awaiting Second Approval",
    approvers: [
      { name: "Sarah Mitchell", approved: true, date: "2024-06-01" },
      { name: "James Okafor", approved: false, date: null },
      { name: "Linda Tran", approved: false, date: null },
    ],
    wbs: "WBS-3201",
    xeroSynced: true,
  },
  {
    id: "BILL-002",
    vendor: "Clearway Civil Contractors",
    amount: 8900.0,
    gst: 890.0,
    phase: "Awaiting Approval",
    approvers: [
      { name: "David Kowalski", approved: false, date: null },
      { name: "Sarah Mitchell", approved: false, date: null },
    ],
    wbs: "WBS-1102",
    xeroSynced: false,
  },
  {
    id: "BILL-003",
    vendor: "Summit Steel Supplies",
    amount: 32100.0,
    gst: 2918.18,
    phase: "Awaiting Final Approval",
    approvers: [
      { name: "Sarah Mitchell", approved: true, date: "2024-06-03" },
      { name: "James Okafor", approved: true, date: "2024-06-04" },
      { name: "Linda Tran", approved: false, date: null },
    ],
    wbs: "WBS-4450",
    xeroSynced: true,
  },
  {
    id: "BILL-004",
    vendor: "Riverstone Aggregates",
    amount: 5600.0,
    gst: 560.0,
    phase: "Fully Approved",
    approvers: [
      { name: "Linda Tran", approved: true, date: "2024-05-28" },
      { name: "David Kowalski", approved: true, date: "2024-05-29" },
    ],
    wbs: "WBS-2210",
    xeroSynced: true,
  },
  {
    id: "BILL-005",
    vendor: "Horizon Hire & Equipment",
    amount: 11750.0,
    gst: 1068.18,
    phase: "Awaiting Second Approval",
    approvers: [
      { name: "James Okafor", approved: true, date: "2024-06-05" },
      { name: "David Kowalski", approved: false, date: null },
    ],
    wbs: "WBS-3105",
    xeroSynced: false,
  },
];

const DAYWORKS_NOTES = [
  { id: 1, author: "Sarah Mitchell", timestamp: "2024-06-07 09:14", text: "Stand-down hours confirmed with site supervisor. 3.5 hrs lost time due to weather." },
  { id: 2, author: "James Okafor", timestamp: "2024-06-07 11:32", text: "Rates verified against current charge schedule. OK to proceed." },
];

const DAYWORKS_LINES = [
  { id: 1, description: "Excavator Operator", hours: 8, rate: 185.0 },
  { id: 2, description: "Site Labourer", hours: 8, rate: 95.0 },
  { id: 3, description: "Stand-down (Weather)", hours: 3.5, rate: 55.0 },
];

const phaseColor = (phase) => {
  if (phase === "Fully Approved") return "bg-emerald-100 text-emerald-800";
  if (phase === "Awaiting Final Approval") return "bg-amber-100 text-amber-800";
  if (phase === "Awaiting Second Approval") return "bg-blue-100 text-blue-800";
  return "bg-rose-100 text-rose-800";
};

export default function MultiPhaseApprovalVisibility() {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [filterPhase, setFilterPhase] = useState("All Phases");
  const [filterApprover, setFilterApprover] = useState("All Approvers");
  const [selectedBill, setSelectedBill] = useState(null);
  const [editGst, setEditGst] = useState("");
  const [activeTab, setActiveTab] = useState("bills");
  const [notes, setNotes] = useState(DAYWORKS_NOTES);
  const [newNote, setNewNote] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Sarah Mitchell");

  const filteredBills = bills.filter((bill) => {
    const phaseMatch = filterPhase === "All Phases" || bill.phase === filterPhase;
    const approverMatch =
      filterApprover === "All Approvers" ||
      bill.approvers.some((a) => a.name === filterApprover && !a.approved);
    return phaseMatch && approverMatch;
  });

  const openBill = (bill) => {
    setSelectedBill({ ...bill });
    setEditGst(bill.gst.toFixed(2));
  };

  const saveGst = () => {
    const parsed = parseFloat(editGst);
    if (!isNaN(parsed)) {
      setBills((prev) => prev.map((b) => b.id === selectedBill.id ? { ...b, gst: parsed } : b));
      setSelectedBill((prev) => ({ ...prev, gst: parsed }));
    }
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setNotes((prev) => [...prev, { id: prev.length + 1, author: noteAuthor, timestamp, text: newNote.trim() }]);
    setNewNote("");
  };

  const dwTotal = DAYWORKS_LINES.reduce((s, l) => s + l.hours * l.rate, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-[#0a0a0a] text-white flex flex-col p-4 gap-2 shrink-0">
        <div className="text-lg font-bold mb-6 text-[#0ea5e9]">Varicon</div>
        {["bills", "dayworks"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t ? "bg-[#0ea5e9] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
          >
            {t === "bills" ? "Bills Approval" : "Day Works Dockets"}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "bills" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Bills — Approval Status</h1>
              <span className="text-sm text-gray-500">{filteredBills.length} of {bills.length} bills</span>
            </div>

            <div className="flex flex-wrap gap-3 bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Approval Phase</label>
                <select
                  value={filterPhase}
                  onChange={(e) => setFilterPhase(e.target.value)}
                  className="border rounded-lg text-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                >
                  {APPROVAL_PHASES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Pending Approver</label>
                <select
                  value={filterApprover}
                  onChange={(e) => setFilterApprover(e.target.value)}
                  className="border rounded-lg text-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                >
                  <option>All Approvers</option>
                  {APPROVERS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setFilterPhase("All Phases"); setFilterApprover("All Approvers"); }}
                  className="text-sm text-[#0ea5e9] hover:underline px-2 py-1.5"
                >
                  Clear filters
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["Bill ID", "Vendor", "Amount (excl. GST)", "GST", "WBS", "Approval Phase", "Approvers", "Xero", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{bill.id}</td>
                      <td className="px-4 py-3 text-gray-700">{bill.vendor}</td>
                      <td className="px-4 py-3 text-gray-700">${bill.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-700">${bill.gst.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-500">{bill.wbs}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${phaseColor(bill.phase)}`}>{bill.phase}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {bill.approvers.map((a) => (
                            <div key={a.name} className="flex items-center gap-1.5">
                              {a.approved
                                ? <span className="text-emerald-500 text-xs">✓</span>
                                : <span className="text-amber-500 text-xs">⏳</span>}
                              <span className={`text-xs ${a.approved ? "text-gray-500 line-through" : "text-gray-800 font-medium"}`}>{a.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${bill.xeroSynced ? "text-emerald-600" : "text-rose-500"}`}>
                          {bill.xeroSynced ? "Synced" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openBill(bill)}
                          className="text-xs px-3 py-1 bg-[#0ea5e9] text-white rounded-lg hover:bg-sky-600 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBills.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No bills match the selected filters.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "dayworks" && (
          <div className="flex flex-col gap-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Day Works Docket — DW-2024-088</h1>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Submitted</span>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">07 Jun 2024</span></div>
                <div><span className="text-gray-500">Site:</span> <span className="font-medium">Northside Link — Zone 4</span></div>
                <div><span className="text-gray-500">Contractor:</span> <span className="font-medium">Apex Earthworks Pty Ltd</span></div>
              </div>
              <table className="w-full text-sm border rounded overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    {["Description", "Hours", "Rate ($/hr)", "Total"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DAYWORKS_LINES.map((line) => (
                    <tr key={line.id} className={line.description.includes("Stand-down") ? "bg-amber-50" : ""}>
                      <td className="px-3 py-2 text-gray-800">{line.description}</td>
                      <td className="px-3 py-2 text-gray-700">{line.hours}</td>
                      <td className="px-3 py-2 text-gray-700">${line.rate.toFixed(2)}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">${(line.hours * line.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t">
                    <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-700 text-sm">Total (excl. GST)</td>
                    <td className="px-3 py-2 font-bold text-gray-900">${dwTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900 text-sm">Internal Notes / Audit Log</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Internal only — not printed on docket</span>
              </div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-800">{note.author}</span>
                      <span className="text-xs text-gray-400">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.text}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex flex-col gap-2">
                <div className="flex gap-2 items-end">
                  <div className="flex flex-col gap-1 w-44">
                    <label className="text-xs font-medium text-gray-500">Your Name</label>
                    <select
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                      className="border rounded-lg text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    >
                      {APPROVERS.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Note</label>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addNote()}
                      placeholder="Add an internal note..."
                      className="border rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] w-full"
                    />
                  </div>
                  <button
                    onClick={addNote}
                    className="px-4 py-1.5 bg-[#0ea5e9] text-white text-sm rounded-lg hover:bg-sky-600 transition-colors shrink-0"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBill(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{selectedBill.id} — {selectedBill.vendor}</h2>
              <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${phaseColor(selectedBill.phase)}`}>{selectedBill.phase}</span>
              <span className="text-xs text-gray-500">WBS: {selectedBill.wbs}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Subtotal (excl. GST)</div>
                <div className="font-bold text-gray-900">${selectedBill.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">GST (editable)</div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    value={editGst}
                    onChange={(e) => setEditGst(e.target.value)}
                    className="border rounded px-2 py-0.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                  <button onClick={saveGst} className="text-xs px-2 py-0.5 bg-[#0ea5e9] text-white rounded hover:bg-sky-600">Save</button>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Approver Status</div>
              <div className="flex flex-col gap-2">
                {selectedBill.approvers.map((a) => (
                  <div key={a.name} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${a.approved ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${a.approved ? "text-emerald-500" : "text-amber-500"}`}>{a.approved ? "✓" : "⏳"}</span>
                      <span className="text-sm font-medium text-gray-800">{a.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{a.approved ? `Approved ${a.date}` : "Pending"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-xs text-gray-400">Xero: {selectedBill.xeroSynced ? "✓ Synced" : "⚠ Pending sync"}</span>
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}