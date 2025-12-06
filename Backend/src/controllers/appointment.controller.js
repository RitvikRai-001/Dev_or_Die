import { asyncHandler } from "../utils/asyncHandler.js";
import { Appointment } from "../models/appointment.model.js";

const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, dateTime, mode, notes } = req.body;
  
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }
  
    if (!dateTime) {
      throw new Error("Appointment date and time is required");
    }
  
    if (!mode) {
      throw new Error("Mode (online/offline) is required");
    }
  
    
    const allowedModes = ["online", "offline"];
    if (!allowedModes.includes(mode)) {
      throw new Error("Mode must be either 'online' or 'offline'");
    }
  
    const appointmentDate = new Date(dateTime);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid dateTime format");
    }
  
    const appointment = await Appointment.create({
      rangerId: req.user._id, // from verifyJWT
      doctorId,
      dateTime: appointmentDate,
      mode,
      notes,
      status: "scheduled"
    });
  
    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment
    });
  });
  

  const getMyAppointments = asyncHandler(async (req, res) => {
    const { role, _id } = req.user;
  
    let filter = {};
  
    if (role === "ranger") {
      filter.rangerId = _id;
    } else if (role === "doctor") {
      filter.doctorId = _id;
    } else if (role === "admin") {
    // the admin will be given access to all the appointments
    } else {
      throw new Error("Invalid user role");
    }
  
    const appointments = await Appointment.find(filter)
      .populate("rangerId", "fullname email")
      .populate("doctorId", "fullname email")
      .sort({ dateTime: 1 });
  
    return res.status(200).json({
      success: true,
      appointments
    });
  });

  const getAppointmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const appointment = await Appointment.findById(id)
      .populate("rangerId", "fullname email")
      .populate("doctorId", "fullname email");
  
    if (!appointment) {
      throw new Error("Appointment not found");
    }
  
    const user = req.user;
  
    const isRanger = user.role === "ranger" && appointment.rangerId.toString() === user._id.toString();
    const isDoctor = user.role === "doctor" && appointment.doctorId.toString() === user._id.toString();
    const isAdmin = user.role === "admin";
  
    if (!isRanger && !isDoctor && !isAdmin) {
      throw new Error("Not authorized to view this appointment");
    }
  
    return res.status(200).json({
      success: true,
      appointment
    });
  });


// Update appointment status (doctor/admin; ranger can cancel their own)

  const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const allowedStatuses = ["scheduled", "completed", "cancelled"];
    if (!status || !allowedStatuses.includes(status)) {
      throw new Error("Invalid or missing status");
    }
  
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
  
    const user = req.user;
    const isRanger = user.role === "ranger" && appointment.rangerId.toString() === user._id.toString();
    const isDoctor = user.role === "doctor" && appointment.doctorId.toString() === user._id.toString();
    const isAdmin = user.role === "admin";
  
    
    //  Ranger can only cancel their own appointment
    //  Doctor or Admin can update any
    if (status === "cancelled") {
      if (!isRanger && !isDoctor && !isAdmin) {
        throw new Error("Not authorized to cancel this appointment");
      }
    } else {
      // "scheduled" or "completed"
      if (!isDoctor && !isAdmin) {
        throw new Error("Only doctors or admins can update appointment status");
      }
    }
  
    appointment.status = status;
    await appointment.save();
  
    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment
    });
  });

  const updateAppointmentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { dateTime, mode, notes } = req.body;
  
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
  
    const user = req.user;
    const isDoctor = user.role === "doctor" && appointment.doctorId.toString() === user._id.toString();
    const isAdmin = user.role === "admin";
  
    
    if (!isDoctor && !isAdmin) {
      throw new Error("Only doctor or admin can update this appointment");
    }
  
    if (appointment.status !== "scheduled") {
      throw new Error("Only scheduled appointments can be updated");
    }
  
    if (dateTime) {
      const newDate = new Date(dateTime);
      if (isNaN(newDate.getTime())) {
        throw new Error("Invalid dateTime format");
      }
      appointment.dateTime = newDate;
    }
  
    if (mode) {
      const allowedModes = ["online", "offline"];
      if (!allowedModes.includes(mode)) {
        throw new Error("Mode must be either 'online' or 'offline'");
      }
      appointment.mode = mode;
    }
  
    if (notes !== undefined) {
      appointment.notes = notes;
    }
  
    await appointment.save();
  
    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment
    });
  });

  const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
  
    const user = req.user;
    const isRanger = user.role === "ranger" && appointment.rangerId.toString() === user._id.toString();
    const isDoctor = user.role === "doctor" && appointment.doctorId.toString() === user._id.toString();
    const isAdmin = user.role === "admin";
  
    if (!isAdmin && !isRanger && !isDoctor) {
      throw new Error("Not authorized to delete this appointment");
    }
  
    // Allow delete if cancelled
    if (!isAdmin && appointment.status !== "cancelled") {
      throw new Error("Only cancelled appointments can be deleted by ranger/doctor");
    }
  
    await appointment.deleteOne();
  
    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully"
    });
  });

  
export {
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    updateAppointmentDetails,
    deleteAppointment
  };
  
  
  
  
  
  
  
  
  


  
  