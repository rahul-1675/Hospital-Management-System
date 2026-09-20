import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { db } from '../data/store.js';

// Helper to format patient name for privacy (e.g. "Rahul Sharma" -> "Rahul S.")
const formatPrivacyName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'Verified Patient';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const first = parts[0];
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${first} ${lastInitial}.`;
};

// In-memory fallback store for reviews if MongoDB is offline
let inMemoryReviews = [
    {
        _id: 'rev-demo-1',
        id: 'rev-demo-1',
        patient: 'user-demo-1',
        patientName: 'Rahul B.',
        doctor: 'doc-1',
        doctorName: 'Dr. Sarah Jenkins',
        hospital: 'hosp-1',
        hospitalName: 'ProHealth Central Super Specialty Hospital',
        department: 'Cardiology',
        appointment: 'apt-demo-1',
        rating: 5,
        comment: 'Outstanding cardiac care. Dr. Jenkins took the time to explain my ECG results thoroughly and the staff was extremely attentive.',
        status: 'PUBLISHED',
        isVerifiedVisit: true,
        isDemoData: true,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
        _id: 'rev-demo-2',
        id: 'rev-demo-2',
        patient: 'user-demo-2',
        patientName: 'Priya K.',
        doctor: 'doc-2',
        doctorName: 'Dr. David Chen',
        hospital: 'hosp-1',
        hospitalName: 'ProHealth Central Super Specialty Hospital',
        department: 'Neurology',
        appointment: 'apt-demo-2',
        rating: 5,
        comment: 'Very professional and empathetic diagnosis. The facility is state of the art and wait times were minimal.',
        status: 'PUBLISHED',
        isVerifiedVisit: true,
        isDemoData: true,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
        _id: 'rev-demo-3',
        id: 'rev-demo-3',
        patient: 'user-demo-3',
        patientName: 'Michael M.',
        doctor: 'doc-3',
        doctorName: 'Dr. Elena Rostova',
        hospital: 'hosp-2',
        hospitalName: 'Metro City Heart & Neuro Institute',
        department: 'Pediatrics',
        appointment: 'apt-demo-3',
        rating: 4,
        comment: 'Wonderful pediatric specialist. She put my daughter completely at ease during the checkup.',
        status: 'PUBLISHED',
        isVerifiedVisit: true,
        isDemoData: true,
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
    }
];

export const reviewController = {
    // POST /api/reviews
    createReview: async (req, res) => {
        try {
            const patientId = req.user ? (req.user._id || req.user.id) : (req.body.patientId || null);
            const { appointmentId, doctorId, hospitalId, rating, comment, patientName } = req.body;

            const parsedRating = Number(rating);
            if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid rating between 1 and 5 stars.'
                });
            }

            if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
                return res.status(400).json({
                    success: false,
                    message: 'Please write a review with at least 10 characters describing your healthcare experience.'
                });
            }

            if (comment.trim().length > 1000) {
                return res.status(400).json({
                    success: false,
                    message: 'Review comment exceeds maximum limit of 1000 characters.'
                });
            }

            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                let verifiedDoctor = null;
                let verifiedHospital = null;
                let isVerified = false;

                if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
                    // Find appointment
                    const appointment = await Appointment.findById(appointmentId)
                        .populate('doctor', 'name department')
                        .populate('hospital', 'name');

                    if (appointment) {
                        verifiedDoctor = appointment.doctor?._id || appointment.doctor;
                        verifiedHospital = appointment.hospital?._id || appointment.hospital;
                        isVerified = appointment.status === 'COMPLETED';

                        // Check for existing review for this appointment
                        if (patientId) {
                            const existingReview = await Review.findOne({
                                appointment: appointmentId,
                                patient: patientId
                            });

                            if (existingReview) {
                                return res.status(409).json({
                                    success: false,
                                    message: 'You have already submitted a review for this appointment.'
                                });
                            }
                        }
                    }
                } else {
                    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
                        verifiedDoctor = doctorId;
                    }
                    if (hospitalId && mongoose.Types.ObjectId.isValid(hospitalId)) {
                        verifiedHospital = hospitalId;
                    }
                }

                // Privacy-safe patient name
                const rawName = req.user?.name || patientName || 'Verified Patient';
                const privacyName = formatPrivacyName(rawName);

                const newReview = await Review.create({
                    patient: (patientId && mongoose.Types.ObjectId.isValid(patientId)) ? patientId : null,
                    patientName: privacyName,
                    appointment: (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) ? appointmentId : null,
                    doctor: verifiedDoctor,
                    hospital: verifiedHospital,
                    rating: parsedRating,
                    comment: comment.trim(),
                    status: 'PUBLISHED',
                    isVerifiedVisit: isVerified || true
                });

                const populated = await Review.findById(newReview._id)
                    .populate('doctor', 'name department specialization')
                    .populate('hospital', 'name address city')
                    .populate('appointment', 'date timeSlot appointmentNumber');

                return res.status(201).json({
                    success: true,
                    message: 'Thank you for your feedback! Your review has been submitted successfully.',
                    data: populated
                });
            }

            // Fallback for mock/test data
            if (appointmentId && patientId) {
                const existingMock = inMemoryReviews.find(
                    r => r.appointment === appointmentId && (r.patient === patientId || r.patient?._id === patientId)
                );
                if (existingMock) {
                    return res.status(409).json({
                        success: false,
                        message: 'You have already submitted a review for this appointment.'
                    });
                }
            }

            const rawName = req.user?.name || patientName || 'Verified Patient';
            const mockReview = {
                _id: `rev-${Date.now()}`,
                id: `rev-${Date.now()}`,
                patient: patientId,
                patientName: formatPrivacyName(rawName),
                appointment: appointmentId || null,
                doctor: doctorId || 'doc-1',
                hospital: hospitalId || 'hosp-1',
                rating: parsedRating,
                comment: comment.trim(),
                status: 'PUBLISHED',
                isVerifiedVisit: true,
                createdAt: new Date().toISOString()
            };

            inMemoryReviews.unshift(mockReview);

            return res.status(201).json({
                success: true,
                message: 'Thank you for your feedback! Your review has been submitted successfully.',
                data: mockReview
            });
        } catch (error) {
            console.error('Error creating review:', error);
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'You have already submitted a review for this appointment.'
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Unable to submit your review right now. Please try again later.'
            });
        }
    },

    // GET /api/reviews
    getReviews: async (req, res) => {
        try {
            const { rating, doctor, hospital, department, page = 1, limit = 20, status = 'PUBLISHED' } = req.query;
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected) {
                const query = { status };
                if (rating) query.rating = Number(rating);
                if (doctor && mongoose.Types.ObjectId.isValid(doctor)) query.doctor = doctor;
                if (hospital && mongoose.Types.ObjectId.isValid(hospital)) query.hospital = hospital;

                const total = await Review.countDocuments(query);
                const skip = (Number(page) - 1) * Number(limit);

                const reviews = await Review.find(query)
                    .populate('doctor', 'name department specialization')
                    .populate('hospital', 'name address city')
                    .populate('appointment', 'date timeSlot')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit));

                // Calculate summary stats across published reviews
                const allPublished = await Review.find({ status: 'PUBLISHED' });
                const totalPublished = allPublished.length;
                const sumRating = allPublished.reduce((acc, r) => acc + (r.rating || 0), 0);
                const averageRating = totalPublished > 0 ? Number((sumRating / totalPublished).toFixed(2)) : 0;

                const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                allPublished.forEach(r => {
                    if (distribution[r.rating] !== undefined) {
                        distribution[r.rating]++;
                    }
                });

                return res.json({
                    success: true,
                    data: reviews,
                    stats: {
                        totalReviews: totalPublished,
                        averageRating,
                        distribution
                    },
                    pagination: {
                        total,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(total / Number(limit))
                    }
                });
            }

            // In-Memory Fallback
            let filtered = inMemoryReviews.filter(r => r.status === status);
            if (rating) filtered = filtered.filter(r => r.rating === Number(rating));
            if (doctor) filtered = filtered.filter(r => r.doctor === doctor || r.doctor?._id === doctor);
            if (hospital) filtered = filtered.filter(r => r.hospital === hospital || r.hospital?._id === hospital);

            const allPublished = inMemoryReviews.filter(r => r.status === 'PUBLISHED');
            const totalPublished = allPublished.length;
            const sumRating = allPublished.reduce((acc, r) => acc + (r.rating || 0), 0);
            const averageRating = totalPublished > 0 ? Number((sumRating / totalPublished).toFixed(2)) : 0;

            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            allPublished.forEach(r => {
                if (distribution[r.rating] !== undefined) {
                    distribution[r.rating]++;
                }
            });

            return res.json({
                success: true,
                data: filtered,
                stats: {
                    totalReviews: totalPublished,
                    averageRating,
                    distribution
                },
                pagination: {
                    total: filtered.length,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: 1
                }
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to load reviews.'
            });
        }
    },

    // GET /api/reviews/doctor/:doctorId
    getDoctorReviews: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected && mongoose.Types.ObjectId.isValid(doctorId)) {
                const reviews = await Review.find({ doctor: doctorId, status: 'PUBLISHED' })
                    .populate('hospital', 'name')
                    .populate('appointment', 'date')
                    .sort({ createdAt: -1 });

                const total = reviews.length;
                const sumRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
                const averageRating = total > 0 ? Number((sumRating / total).toFixed(2)) : 0;

                return res.json({
                    success: true,
                    data: reviews,
                    stats: {
                        totalReviews: total,
                        averageRating
                    }
                });
            }

            const reviews = inMemoryReviews.filter(r => (r.doctor === doctorId || r.doctor?._id === doctorId) && r.status === 'PUBLISHED');
            const total = reviews.length;
            const sumRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
            const averageRating = total > 0 ? Number((sumRating / total).toFixed(2)) : 0;

            return res.json({
                success: true,
                data: reviews,
                stats: {
                    totalReviews: total,
                    averageRating
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reviews/hospital/:hospitalId
    getHospitalReviews: async (req, res) => {
        try {
            const { hospitalId } = req.params;
            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected && mongoose.Types.ObjectId.isValid(hospitalId)) {
                const reviews = await Review.find({ hospital: hospitalId, status: 'PUBLISHED' })
                    .populate('doctor', 'name department')
                    .populate('appointment', 'date')
                    .sort({ createdAt: -1 });

                const total = reviews.length;
                const sumRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
                const averageRating = total > 0 ? Number((sumRating / total).toFixed(2)) : 0;

                return res.json({
                    success: true,
                    data: reviews,
                    stats: {
                        totalReviews: total,
                        averageRating
                    }
                });
            }

            const reviews = inMemoryReviews.filter(r => (r.hospital === hospitalId || r.hospital?._id === hospitalId) && r.status === 'PUBLISHED');
            const total = reviews.length;
            const sumRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
            const averageRating = total > 0 ? Number((sumRating / total).toFixed(2)) : 0;

            return res.json({
                success: true,
                data: reviews,
                stats: {
                    totalReviews: total,
                    averageRating
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/reviews/patient
    getPatientReviews: async (req, res) => {
        try {
            const patientId = req.user ? (req.user._id || req.user.id) : null;
            if (!patientId) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected && mongoose.Types.ObjectId.isValid(patientId)) {
                const reviews = await Review.find({ patient: patientId })
                    .populate('doctor', 'name department specialization qualifications')
                    .populate('hospital', 'name address city')
                    .populate('appointment', 'date timeSlot appointmentNumber status')
                    .sort({ createdAt: -1 });

                return res.json({
                    success: true,
                    data: reviews
                });
            }

            const reviews = inMemoryReviews.filter(r => r.patient === patientId || r.patient?._id === patientId);
            return res.json({
                success: true,
                data: reviews
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // PATCH /api/reviews/:id/status (Admin Moderation)
    updateReviewStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['PUBLISHED', 'PENDING', 'HIDDEN'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be PUBLISHED, PENDING, or HIDDEN.'
                });
            }

            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
                const review = await Review.findByIdAndUpdate(id, { status }, { new: true })
                    .populate('doctor', 'name department')
                    .populate('hospital', 'name');

                if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
                return res.json({ success: true, message: `Review status updated to ${status}`, data: review });
            }

            const revIndex = inMemoryReviews.findIndex(r => r._id === id || r.id === id);
            if (revIndex !== -1) {
                inMemoryReviews[revIndex].status = status;
                return res.json({ success: true, message: `Review status updated to ${status}`, data: inMemoryReviews[revIndex] });
            }

            return res.status(404).json({ success: false, message: 'Review not found.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // DELETE /api/reviews/:id
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user ? (req.user._id || req.user.id) : null;
            const userRole = req.user?.role;

            const isMongoConnected = mongoose.connection.readyState === 1;

            if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
                const review = await Review.findById(id);
                if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

                // Allow if user is Admin OR owner of review
                if (userRole !== 'admin' && review.patient.toString() !== userId?.toString()) {
                    return res.status(403).json({ success: false, message: 'You are not authorized to delete this review.' });
                }

                await Review.findByIdAndDelete(id);
                return res.json({ success: true, message: 'Review deleted successfully.' });
            }

            const revIndex = inMemoryReviews.findIndex(r => r._id === id || r.id === id);
            if (revIndex !== -1) {
                inMemoryReviews.splice(revIndex, 1);
                return res.json({ success: true, message: 'Review deleted successfully.' });
            }

            return res.status(404).json({ success: false, message: 'Review not found.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
