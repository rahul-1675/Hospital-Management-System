import React from 'react';

const HeroSection = () => {
    return (
        <section className="bg-blue-600 text-white py-20 text-center">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Your Health, Our Priority</h1>
                <p className="text-xl mb-8">Comprehensive healthcare services you can trust.</p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                    Book an Appointment
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
