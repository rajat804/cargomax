"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

/* ---------------- TYPES ---------------- */

type Attendance = {
  id: number;
  date: string;
  status: "present" | "absent" | "late";
  checkIn: string | null;
  checkOut: string | null;
};

type LeaveRequest = {
  id: number;
  from: string;
  to: string;
  reason: string;
  reasonType: string;
  appliedOn: string;
  status: "approved" | "rejected" | "pending";
  remarks: string;
};

type LeaveForm = {
  startDate: string;
  endDate: string;
  reasonType: string;
  remarks: string;
};

/* ---------------- COMPONENT ---------------- */

export default function AttendanceManager() {

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] =
    useState<"present" | "absent" | "late">("present");

  const [leaveForm, setLeaveForm] = useState<LeaveForm>({
    startDate: "",
    endDate: "",
    reasonType: "sick",
    remarks: "",
  });

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchAttendance();
    fetchLeaveRequests();
  }, []);

  const fetchAttendance = async () => {
    const mockAttendance: Attendance[] = [
      { id: 1, date: "2025-10-09", status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM" },
      { id: 2, date: "2025-10-08", status: "present", checkIn: "09:15 AM", checkOut: "06:00 PM" },
      { id: 3, date: "2025-10-07", status: "absent", checkIn: null, checkOut: null },
      { id: 4, date: "2025-10-06", status: "late", checkIn: "10:30 AM", checkOut: "06:30 PM" },
    ];

    setAttendance(mockAttendance);
  };

  const fetchLeaveRequests = async () => {
    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: 1,
        from: "2025-10-24",
        to: "2025-10-24",
        reason: "Injured",
        reasonType: "sick",
        appliedOn: "2025-10-09",
        status: "rejected",
        remarks: "Need medical certificate",
      },
      {
        id: 2,
        from: "2025-10-15",
        to: "2025-10-17",
        reason: "Family function",
        reasonType: "personal",
        appliedOn: "2025-10-10",
        status: "approved",
        remarks: "Enjoy!",
      },
      {
        id: 3,
        from: "2025-11-01",
        to: "2025-11-03",
        reason: "Not feeling well",
        reasonType: "sick",
        appliedOn: "2025-10-28",
        status: "pending",
        remarks: "Will provide certificate",
      },
    ];

    setLeaveRequests(mockLeaveRequests);
  };

  /* ---------------- FUNCTIONS ---------------- */

  const markAttendance = (date: Date, status: "present" | "absent" | "late") => {
    const newRecord: Attendance = {
      id: attendance.length + 1,
      date: format(date, "yyyy-MM-dd"),
      status,
      checkIn: status === "absent" ? null : "09:00 AM",
      checkOut: status === "absent" ? null : "06:00 PM",
    };

    setAttendance([newRecord, ...attendance]);
    setShowAttendanceModal(false);
  };

  const submitLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: LeaveRequest = {
      id: leaveRequests.length + 1,
      from: leaveForm.startDate,
      to: leaveForm.endDate,
      reason: leaveForm.remarks,
      reasonType: leaveForm.reasonType,
      appliedOn: format(new Date(), "yyyy-MM-dd"),
      status: "pending",
      remarks: leaveForm.remarks,
    };

    setLeaveRequests([newRequest, ...leaveRequests]);

    setShowLeaveModal(false);

    setLeaveForm({
      startDate: "",
      endDate: "",
      reasonType: "sick",
      remarks: "",
    });
  };

  const updateLeaveStatus = (id: number, status: "approved" | "rejected") => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    );
  };

  /* ---------------- BADGES ---------------- */

  const getStatusBadge = (status: string) => {
    if (status === "approved")
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Approved</span>;

    if (status === "rejected")
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Rejected</span>;

    return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Pending</span>;
  };

  const getAttendanceBadge = (status: string) => {
    if (status === "present")
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Present</span>;

    if (status === "absent")
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Absent</span>;

    return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">Late</span>;
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>

      <button
        onClick={() => setShowAttendanceModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Mark Attendance
      </button>

      <div className="mt-6 space-y-3">

        {attendance.map((record) => (
          <div
            key={record.id}
            className="flex justify-between p-3 border rounded bg-white"
          >
            <div>
              <p className="font-semibold">{record.date}</p>

              {record.checkIn && (
                <p className="text-sm text-gray-500">
                  {record.checkIn} - {record.checkOut}
                </p>
              )}
            </div>

            {getAttendanceBadge(record.status)}
          </div>
        ))}

      </div>

    </div>
  );
}