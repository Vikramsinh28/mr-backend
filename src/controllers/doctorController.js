import { Op } from 'sequelize';
import { Doctor, User } from '../models/index.js';
import { success, created, notFound, forbidden } from '../utils/response.js';

export const listDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, specialty, status, preferred } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { doctorName: { [Op.iLike]: `%${search}%` } },
        { hospital: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (specialty) where.specialty = { [Op.iLike]: specialty };
    if (status) where.status = status;
    if (preferred !== undefined) {
      if (preferred === 'true' || preferred === true) where.preferredDoctor = true;
      if (preferred === 'false' || preferred === false) where.preferredDoctor = false;
    }

    const { count, rows } = await Doctor.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Doctors retrieved successfully', {
      doctors: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!doctor) return notFound(res, 'Doctor not found');

    return success(res, 'Doctor retrieved successfully', { doctor });
  } catch (err) {
    next(err);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const {
      // snake_case preferred
      doctor_name,
      experience_years,
      consultation_fee,
      preferred_doctor,
      // fallback camelCase for backward compatibility
      doctorName,
      experienceYears,
      consultationFee,
      preferredDoctor,
      // common fields
      specialty,
      hospital,
      location,
      phone,
      email,
      status,
      qualification,
      availability,
      notes
    } = req.body;

    const doctor = await Doctor.create({
      doctorName: doctor_name ?? doctorName,
      specialty,
      hospital,
      location,
      phone,
      email,
      experienceYears: experience_years ?? experienceYears,
      consultationFee: consultation_fee ?? consultationFee,
      status: status || 'active',
      qualification,
      availability,
      notes,
      preferredDoctor: (preferred_doctor ?? preferredDoctor) ?? false,
      createdBy: req.user.id
    });

    await doctor.reload({ include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }] });

    return created(res, 'Doctor created successfully', { doctor });
  } catch (err) {
    next(err);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);

    if (!doctor) return notFound(res, 'Doctor not found');

    // Only creator or users with doctor.edit can update
    if (doctor.createdBy !== req.user.id && !req.userPermissions?.includes('doctor.edit')) {
      return forbidden(res, 'You are not allowed to update this doctor');
    }

    // Map snake_case (preferred) and camelCase (legacy) to model fields
    const {
      doctor_name,
      specialty,
      hospital,
      location,
      phone,
      email,
      experience_years,
      consultation_fee,
      status,
      qualification,
      availability,
      notes,
      preferred_doctor,
      // legacy camelCase fallbacks
      doctorName,
      experienceYears,
      consultationFee,
      preferredDoctor
    } = req.body;

    if (doctor_name !== undefined || doctorName !== undefined) doctor.doctorName = doctor_name ?? doctorName;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (hospital !== undefined) doctor.hospital = hospital;
    if (location !== undefined) doctor.location = location;
    if (phone !== undefined) doctor.phone = phone;
    if (email !== undefined) doctor.email = email;
    if (experience_years !== undefined || experienceYears !== undefined) doctor.experienceYears = experience_years ?? experienceYears;
    if (consultation_fee !== undefined || consultationFee !== undefined) doctor.consultationFee = consultation_fee ?? consultationFee;
    if (status !== undefined) doctor.status = status;
    if (qualification !== undefined) doctor.qualification = qualification;
    if (availability !== undefined) doctor.availability = availability;
    if (notes !== undefined) doctor.notes = notes;
    if (preferred_doctor !== undefined || preferredDoctor !== undefined) doctor.preferredDoctor = preferred_doctor ?? preferredDoctor;

    doctor.updatedBy = req.user.id;

    await doctor.save();

    await doctor.reload({ include: [
      { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }
    ]});

    return success(res, 'Doctor updated successfully', { doctor });
  } catch (err) {
    next(err);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);

    if (!doctor) return notFound(res, 'Doctor not found');

    // Only creator or users with doctor.delete can delete
    if (doctor.createdBy !== req.user.id && !req.userPermissions?.includes('doctor.delete')) {
      return forbidden(res, 'You are not allowed to delete this doctor');
    }

    await doctor.destroy();

    return success(res, 'Doctor deleted successfully');
  } catch (err) {
    next(err);
  }
};
