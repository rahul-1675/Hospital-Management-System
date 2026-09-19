import mongoose from 'mongoose';
import { Hospital } from '../models/Hospital.js';
import { Doctor } from '../models/Doctor.js';
import { MOCK_HOSPITALS, MOCK_DOCTORS, calculateDistanceMeters } from '../data/mockFallback.js';

export const hospitalController = {
    // GET /api/hospitals
    getHospitals: async (req, res) => {
        try {
            const { search, specialty, department, city, page = 1, limit = 12 } = req.query;

            if (mongoose.connection.readyState === 1) {
                const query = {};
                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { city: { $regex: search, $options: 'i' } },
                        { address: { $regex: search, $options: 'i' } },
                        { departments: { $regex: search, $options: 'i' } }
                    ];
                }
                if (city) query.city = { $regex: city, $options: 'i' };
                if (department) query.departments = department;
                if (specialty) query.specialties = specialty;

                const total = await Hospital.countDocuments(query);
                if (total > 0) {
                    const skip = (Number(page) - 1) * Number(limit);
                    const hospitals = await Hospital.find(query)
                        .populate('specialties')
                        .skip(skip)
                        .limit(Number(limit))
                        .sort({ rating: -1 });

                    return res.json({
                        success: true,
                        data: hospitals,
                        pagination: {
                            total,
                            page: Number(page),
                            limit: Number(limit),
                            totalPages: Math.ceil(total / Number(limit))
                        }
                    });
                }
            }

            // Fallback filtering
            let filtered = [...MOCK_HOSPITALS];
            if (search) {
                const s = search.toLowerCase();
                filtered = filtered.filter(h =>
                    h.name.toLowerCase().includes(s) ||
                    h.city.toLowerCase().includes(s) ||
                    h.address.toLowerCase().includes(s) ||
                    h.departments.some(d => d.toLowerCase().includes(s))
                );
            }
            if (city) {
                filtered = filtered.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
            }
            if (department) {
                filtered = filtered.filter(h => h.departments.includes(department));
            }
            if (specialty) {
                filtered = filtered.filter(h => h.specialties.some(sp => sp.name === specialty || sp.slug === specialty || sp._id === specialty));
            }

            const total = filtered.length;
            const skip = (Number(page) - 1) * Number(limit);
            const paginated = filtered.slice(skip, skip + Number(limit));

            return res.json({
                success: true,
                data: paginated,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/hospitals/nearby (Geospatial $near or Haversine distance)
    getNearbyHospitals: async (req, res) => {
        try {
            const { lng, lat, maxDistance = 50000, specialty, limit = 10 } = req.query;

            if (!lng || !lat) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude and Longitude query parameters (lat, lng) are required for nearby search.'
                });
            }

            const userLng = parseFloat(lng);
            const userLat = parseFloat(lat);

            if (mongoose.connection.readyState === 1) {
                try {
                    const query = {
                        location: {
                            $near: {
                                $geometry: {
                                    type: 'Point',
                                    coordinates: [userLng, userLat]
                                },
                                $maxDistance: parseInt(maxDistance)
                            }
                        }
                    };
                    if (specialty) query.specialties = specialty;

                    const hospitals = await Hospital.find(query)
                        .populate('specialties')
                        .limit(parseInt(limit));

                    if (hospitals.length > 0) {
                        const withDistance = hospitals.map(h => {
                            const [hLng, hLat] = h.location.coordinates;
                            const distanceMeters = calculateDistanceMeters(userLat, userLng, hLat, hLng);
                            return {
                                ...h.toObject(),
                                distanceMeters: Math.round(distanceMeters),
                                distanceKm: (distanceMeters / 1000).toFixed(1)
                            };
                        });

                        return res.json({
                            success: true,
                            count: withDistance.length,
                            userLocation: { longitude: userLng, latitude: userLat },
                            data: withDistance
                        });
                    }
                } catch (_) {}
            }

            // Fallback geospatial calculation
            let hospitalsWithDistance = MOCK_HOSPITALS.map(h => {
                const [hLng, hLat] = h.location.coordinates;
                const distanceMeters = calculateDistanceMeters(userLat, userLng, hLat, hLng);
                return {
                    ...h,
                    distanceMeters: Math.round(distanceMeters),
                    distanceKm: (distanceMeters / 1000).toFixed(1)
                };
            });

            if (specialty) {
                hospitalsWithDistance = hospitalsWithDistance.filter(h =>
                    h.specialties.some(sp => sp.name === specialty || sp.slug === specialty || sp._id === specialty)
                );
            }

            // Sort by nearest distance
            hospitalsWithDistance.sort((a, b) => a.distanceMeters - b.distanceMeters);

            const result = hospitalsWithDistance.filter(h => h.distanceMeters <= parseInt(maxDistance)).slice(0, parseInt(limit));

            return res.json({
                success: true,
                count: result.length,
                userLocation: { longitude: userLng, latitude: userLat },
                data: result
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // GET /api/hospitals/:id
    getHospitalById: async (req, res) => {
        try {
            const { id } = req.params;

            if (mongoose.connection.readyState === 1) {
                const hospital = await Hospital.findById(id).populate('specialties');
                if (hospital) {
                    const doctors = await Doctor.find({ hospital: id }).populate('specialty').sort({ rating: -1 });
                    return res.json({ success: true, data: hospital, doctors });
                }
            }

            const hospital = MOCK_HOSPITALS.find(h => h._id === id || h.id === id || h.slug === id);
            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Hospital not found' });
            }

            const doctors = MOCK_DOCTORS.filter(d => d.hospital._id === hospital._id || d.hospital.id === hospital.id);

            return res.json({
                success: true,
                data: hospital,
                doctors
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // POST /api/hospitals (Admin)
    createHospital: async (req, res) => {
        try {
            const data = req.body;
            if (!data.slug && data.name) {
                data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            }
            if (mongoose.connection.readyState === 1) {
                const hospital = await Hospital.create(data);
                return res.status(201).json({ success: true, data: hospital });
            }
            const newHosp = { ...data, _id: `hosp-${Date.now()}` };
            MOCK_HOSPITALS.push(newHosp);
            return res.status(201).json({ success: true, data: newHosp });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
