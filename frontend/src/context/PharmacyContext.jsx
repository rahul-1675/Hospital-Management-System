import React, { createContext, useContext, useState, useEffect } from 'react';
import { pharmacyService } from '../services/pharmacy.service';

const PharmacyContext = createContext();

export const usePharmacy = () => useContext(PharmacyContext);

const initialInventory = [
    { id: 1, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 120, reorderLevel: 50, expiry: '2024-12-01', price: 15.00 },
    { id: 2, name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 45, reorderLevel: 50, expiry: '2025-06-15', price: 5.00 },
    { id: 3, name: 'Metformin 850mg', category: 'Diabetes', stock: 200, reorderLevel: 60, expiry: '2024-10-20', price: 12.50 },
    { id: 4, name: 'Atorvastatin 20mg', category: 'Cardiology', stock: 10, reorderLevel: 30, expiry: '2024-08-30', price: 25.00 },
    { id: 5, name: 'Omeprazole 20mg', category: 'Gastro', stock: 80, reorderLevel: 40, expiry: '2025-02-10', price: 8.00 }
];

const initialPrescriptions = [
    {
        id: 'RX-2024-001',
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        date: '2024-02-01',
        status: 'pending',
        items: [
            { medicineId: 1, name: 'Amoxicillin 500mg', dosage: '1 tablet', freq: '3x daily', duration: '7 days', qty: 21 },
            { medicineId: 2, name: 'Paracetamol 500mg', dosage: '1 tablet', freq: 'SOS', duration: '5 days', qty: 10 }
        ]
    },
    {
        id: 'RX-2024-002',
        patientName: 'Sarah Connor',
        doctorName: 'Dr. Jones',
        date: '2024-02-01',
        status: 'pending',
        items: [
            { medicineId: 4, name: 'Atorvastatin 20mg', dosage: '1 tablet', freq: 'Nightly', duration: '30 days', qty: 30 }
        ]
    },
    {
        id: 'RX-2024-003',
        patientName: 'Kyle Reese',
        doctorName: 'Dr. Silberman',
        date: '2024-02-02',
        status: 'dispensed',
        dispensedAt: '2024-02-02T10:30:00',
        items: [
            { medicineId: 5, name: 'Omeprazole 20mg', dosage: '1 capsule', freq: 'Morning', duration: '14 days', qty: 14 }
        ]
    }
];

export const PharmacyProvider = ({ children }) => {
    const [inventory, setInventory] = useState(initialInventory);
    const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
    const [recentDispenses, setRecentDispenses] = useState([
        { id: 101, medicine: 'Omeprazole 20mg', patient: 'Kyle Reese', qty: 14, date: '2024-02-02 10:30 AM', status: 'Completed' }
    ]);
    const [orders, setOrders] = useState([
        { id: 'ORD-2024-001', supplier: 'PharmaDist Inc.', date: '2024-02-01', status: 'Received', totalCost: 450.00, items: [{ medicineId: 1, name: 'Amoxicillin 500mg', qty: 100 }] },
        { id: 'ORD-2024-002', supplier: 'MediSupply Co.', date: '2024-02-03', status: 'Pending', totalCost: 200.00, items: [{ medicineId: 3, name: 'Metformin 850mg', qty: 50 }] }
    ]);

    const [pharmacistProfile, setPharmacistProfile] = useState({
        name: 'Sarah Pharmacist',
        id: 'PH-9921',
        email: 'sarah.p@hospital.com',
        phone: '+1 (555) 000-8888',
        shift: 'Morning (8AM - 4PM)'
    });

    useEffect(() => {
        const fetchPharmacyData = async () => {
            const fetchedInv = await pharmacyService.getInventory();
            if (fetchedInv && fetchedInv.length > 0) setInventory(fetchedInv);
            const fetchedRx = await pharmacyService.getPrescriptions();
            if (fetchedRx && fetchedRx.length > 0) setPrescriptions(fetchedRx);
        };
        fetchPharmacyData();
    }, []);

    // Actions
    const rejectPrescription = (id, reason) => {
        setPrescriptions(prev => prev.map(p =>
            p.id === id ? { ...p, status: 'rejected', rejectedReason: reason } : p
        ));
        showNotification(`Prescription ${id} rejected.`);
    };

    const addMedicine = (medicine) => {
        const newMed = { ...medicine, id: Date.now() };
        setInventory(prev => [...prev, newMed]);
        pharmacyService.addMedicine(newMed);
        showNotification('New medicine added to inventory.');
    };

    const updateInventoryItem = (id, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
        pharmacyService.updateMedicine(id, updates);
        showNotification('Inventory updated successfully.');
    };

    const removeMedicine = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
        pharmacyService.deleteMedicine(id);
        showNotification('Medicine removed from inventory.');
    };

    const createOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);
        showNotification('Purchase order created.');
    };

    const receiveOrder = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Update Inventory
        const updatedInventory = [...inventory];
        order.items.forEach(orderItem => {
            const index = updatedInventory.findIndex(i => i.id === orderItem.medicineId || i.name === orderItem.name);
            if (index !== -1) {
                updatedInventory[index] = {
                    ...updatedInventory[index],
                    stock: updatedInventory[index].stock + parseInt(orderItem.qty)
                };
            }
        });

        setInventory(updatedInventory);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Received' } : o));
        showNotification(`Order ${orderId} received. Inventory updated.`);
    };

    const updateProfile = (data) => {
        setPharmacistProfile(prev => ({ ...prev, ...data }));
        showNotification('Profile updated successfully.');
    };

    const [notifications, setNotifications] = useState([]);

    const showNotification = (msg) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, msg }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
    };

    const dispensePrescription = (prescriptionId) => {
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) return;

        // Check Inventory
        const canDispense = prescription.items.every(item => {
            const med = inventory.find(m => m.id === item.medicineId || m.name === item.name || m.name?.toLowerCase().includes(item.medicine?.toLowerCase()));
            return !med || med.stock >= item.qty || med.stock >= (item.quantity || 1);
        });

        if (!canDispense) {
            showNotification('Error: Insufficient stock to dispense.');
            return;
        }

        // Deduct Stock
        const newInventory = inventory.map(med => {
            const item = prescription.items.find(i => i.medicineId === med.id || i.name === med.name);
            if (item) {
                const qtyToDeduct = item.qty || item.quantity || 1;
                return { ...med, stock: Math.max(0, med.stock - qtyToDeduct) };
            }
            return med;
        });

        // Update Prescription Status
        const newPrescriptions = prescriptions.map(p =>
            p.id === prescriptionId ? { ...p, status: 'dispensed', dispensedAt: new Date().toISOString() } : p
        );

        // Add to Recent Dispenses
        const newDispenses = prescription.items.map((item, idx) => ({
            id: Date.now() + idx,
            medicine: item.name || item.medicine,
            patient: prescription.patientName,
            qty: item.qty || item.quantity || 1,
            date: new Date().toLocaleString(),
            status: 'Completed'
        }));

        setInventory(newInventory);
        setPrescriptions(newPrescriptions);
        setRecentDispenses(prev => [...newDispenses, ...prev]);
        pharmacyService.dispensePrescription(prescriptionId);
        showNotification('Medicines dispensed successfully.');
    };

    const lowStockCount = inventory.filter(i => i.stock <= (i.reorderLevel || i.minThreshold || 50)).length;
    const pendingCount = prescriptions.filter(p => p.status === 'pending' || p.status === 'Pending').length;

    return (
        <PharmacyContext.Provider value={{
            inventory,
            prescriptions,
            recentDispenses,
            notifications,
            orders,
            pharmacistProfile,
            dispensePrescription,
            rejectPrescription,
            addMedicine,
            updateInventoryItem,
            removeMedicine,
            createOrder,
            receiveOrder,
            updateProfile,
            stats: { lowStockCount, pendingCount }
        }}>
            {children}
            {/* Toast Container */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        background: '#0284c7', color: 'white', padding: '12px 24px', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease'
                    }}>
                        {n.msg}
                    </div>
                ))}
            </div>
        </PharmacyContext.Provider>
    );
};
