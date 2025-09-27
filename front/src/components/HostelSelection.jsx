import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../styles/theme';

const HostelSelection = () => {
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingStep, setBookingStep] = useState('selection'); // 'selection', 'confirmation', 'payment'

    // Mock hostel data - in real app, this would come from API
    const hostels = [
        {
            id: 1,
            name: "Boys Hostel A",
            type: "boys",
            floors: 4,
            totalRooms: 120,
            availableRooms: 23,
            facilities: ["WiFi", "Laundry", "Mess", "Gym", "Common Room"],
            price: 15000,
            image: "/api/placeholder/300/200"
        },
        {
            id: 2,
            name: "Boys Hostel B", 
            type: "boys",
            floors: 3,
            totalRooms: 90,
            availableRooms: 12,
            facilities: ["WiFi", "Laundry", "Mess", "Library"],
            price: 12000,
            image: "/api/placeholder/300/200"
        },
        {
            id: 3,
            name: "Girls Hostel A",
            type: "girls",
            floors: 4,
            totalRooms: 100,
            availableRooms: 31,
            facilities: ["WiFi", "Laundry", "Mess", "Gym", "Common Room", "Security"],
            price: 16000,
            image: "/api/placeholder/300/200"
        },
        {
            id: 4,
            name: "Girls Hostel B",
            type: "girls", 
            floors: 3,
            totalRooms: 75,
            availableRooms: 8,
            facilities: ["WiFi", "Laundry", "Mess", "Study Hall"],
            price: 13000,
            image: "/api/placeholder/300/200"
        }
    ];

    // Generate room data for selected hostel and floor
    const generateRoomData = (hostelId, floor) => {
        const roomsPerFloor = 30;
        const rooms = [];
        const roomStatuses = ['available', 'occupied', 'maintenance', 'reserved'];
        
        for (let i = 1; i <= roomsPerFloor; i++) {
            const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
            const randomStatus = Math.random();
            let status;
            
            if (randomStatus < 0.3) status = 'available';
            else if (randomStatus < 0.7) status = 'occupied';
            else if (randomStatus < 0.85) status = 'reserved';
            else status = 'maintenance';
            
            rooms.push({
                id: `${hostelId}-${roomNumber}`,
                number: roomNumber,
                floor: floor,
                type: Math.random() > 0.7 ? 'single' : 'double',
                status: status,
                price: status === 'available' ? (Math.random() > 0.5 ? 8000 : 6000) : null
            });
        }
        return rooms;
    };

    const [roomData, setRoomData] = useState([]);

    useEffect(() => {
        if (selectedHostel) {
            setRoomData(generateRoomData(selectedHostel.id, selectedFloor));
        }
    }, [selectedHostel, selectedFloor]);

    const getRoomStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white';
            case 'occupied': return 'bg-red-500/20 cursor-not-allowed border-red-500/30 text-red-400';
            case 'reserved': return 'bg-amber-500/20 cursor-not-allowed border-amber-500/30 text-amber-400';
            case 'maintenance': return 'bg-slate-500/20 cursor-not-allowed border-slate-500/30 text-slate-400';
            default: return 'bg-slate-600/20 border-slate-600/30 text-slate-400';
        }
    };

    const getRoomStatusIcon = (status) => {
        switch (status) {
            case 'available': return 'ri-checkbox-blank-line';
            case 'occupied': return 'ri-user-fill';
            case 'reserved': return 'ri-lock-line';
            case 'maintenance': return 'ri-tools-line';
            default: return 'ri-question-line';
        }
    };

    const handleRoomSelect = (room) => {
        if (room.status === 'available') {
            setSelectedRoom(room);
        }
    };

    const handleBooking = () => {
        if (selectedRoom) {
            setShowBookingModal(true);
            setBookingStep('confirmation');
        }
    };

    const HostelCard = ({ hostel }) => (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`${themeClasses.primaryCard} cursor-pointer overflow-hidden transition-all duration-300 border-2 ${
                selectedHostel?.id === hostel.id 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/25' 
                    : 'border-slate-700 hover:border-indigo-400 hover:shadow-xl'
            }`}
            onClick={() => setSelectedHostel(hostel)}
        >
            <div className="relative h-48 bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                <i className="ri-building-2-line text-6xl text-white"></i>
                {selectedHostel?.id === hostel.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-white font-bold"></i>
                    </div>
                )}
            </div>
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className={themeClasses.secondaryHeading}>{hostel.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        hostel.type === 'boys' 
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                            : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    }`}>
                        {hostel.type === 'boys' ? 'Boys' : 'Girls'}
                    </span>
                </div>
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className={themeClasses.mutedText}>Available Rooms:</span>
                        <span className="font-semibold text-emerald-400">{hostel.availableRooms}/{hostel.totalRooms}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className={themeClasses.mutedText}>Floors:</span>
                        <span className="font-semibold text-white">{hostel.floors}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className={themeClasses.mutedText}>Starting Price:</span>
                        <span className="font-bold text-indigo-400">₹{hostel.price.toLocaleString()}/sem</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                    {hostel.facilities.slice(0, 3).map((facility, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600">
                            {facility}
                        </span>
                    ))}
                    {hostel.facilities.length > 3 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600">
                            +{hostel.facilities.length - 3} more
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Header */}
            <div className="bg-gray-800/95 shadow-sm border-b border-slate-700/30 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Hostel Selection</h1>
                            <p className="text-slate-400">Choose your accommodation for the semester</p>
                        </div>
                        
                        {selectedRoom && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={handleBooking}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg"
                            >
                                <i className="ri-bookmark-line mr-2"></i>
                                Book Room {selectedRoom.number}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!selectedHostel ? (
                    /* Hostel Selection Grid */
                    <div>
                        <div className="mb-8">
                            <h2 className={themeClasses.secondaryHeading}>Available Hostels</h2>
                            <p className={themeClasses.mutedText}>Select a hostel to view available rooms</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {hostels.map((hostel) => (
                                <HostelCard key={hostel.id} hostel={hostel} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Room Selection Interface */
                    <div className="space-y-6">
                        {/* Hostel Info Header */}
                        <div className={`${themeClasses.primaryCard} p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className={themeClasses.primaryHeading}>{selectedHostel.name}</h2>
                                    <p className={themeClasses.mutedText}>Select a room from the floor plan</p>
                                </div>
                                <button
                                    onClick={() => setSelectedHostel(null)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 border border-slate-600"
                                >
                                    <i className="ri-arrow-left-line mr-2"></i>
                                    Back to Hostels
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-emerald-500 rounded border border-emerald-400"></div>
                                    <span className="text-sm text-slate-300">Available</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-500 rounded border border-red-400"></div>
                                    <span className="text-sm text-slate-300">Occupied</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-amber-500 rounded border border-amber-400"></div>
                                    <span className="text-sm text-slate-300">Reserved</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-slate-500 rounded border border-slate-400"></div>
                                    <span className="text-sm text-slate-300">Maintenance</span>
                                </div>
                            </div>
                        </div>

                        {/* Floor Selection */}
                        <div className={`${themeClasses.primaryCard} p-6`}>
                            <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Select Floor</h3>
                            <div className="flex space-x-2">
                                {Array.from({ length: selectedHostel.floors }, (_, i) => i + 1).map((floor) => (
                                    <button
                                        key={floor}
                                        onClick={() => setSelectedFloor(floor)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border ${
                                            selectedFloor === floor
                                                ? 'bg-indigo-600 text-white shadow-lg border-indigo-500'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600'
                                        }`}
                                    >
                                        Floor {floor}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Room Grid */}
                        <div className={`${themeClasses.primaryCard} p-6`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={themeClasses.secondaryHeading}>
                                    Floor {selectedFloor} - Room Layout
                                </h3>
                                {selectedRoom && (
                                    <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg px-4 py-2">
                                        <span className="text-indigo-300 font-semibold">
                                            Selected: Room {selectedRoom.number} - ₹{selectedRoom.price?.toLocaleString()}/sem
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                {roomData.map((room) => (
                                    <motion.button
                                        key={room.id}
                                        whileHover={room.status === 'available' ? { scale: 1.1 } : {}}
                                        whileTap={room.status === 'available' ? { scale: 0.95 } : {}}
                                        onClick={() => handleRoomSelect(room)}
                                        className={`
                                            relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-semibold transition-all duration-200
                                            ${getRoomStatusColor(room.status)}
                                            ${selectedRoom?.id === room.id ? 'ring-4 ring-indigo-400/50 scale-110' : ''}
                                            ${room.status === 'available' ? 'text-white' : 'text-white'}
                                        `}
                                        disabled={room.status !== 'available'}
                                    >
                                        <i className={`${getRoomStatusIcon(room.status)} text-lg mb-1`}></i>
                                        <span>{room.number}</span>
                                        {room.status === 'available' && (
                                            <span className="text-xs opacity-75">₹{room.price}</span>
                                        )}
                                        
                                        {selectedRoom?.id === room.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-slate-800"
                                            >
                                                <i className="ri-check-line text-xs text-white"></i>
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowBookingModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`${themeClasses.primaryCard} rounded-2xl shadow-2xl max-w-md w-full p-6`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="ri-building-2-line text-2xl text-emerald-400"></i>
                                </div>
                                <h3 className={`${themeClasses.secondaryHeading} mb-2`}>Confirm Booking</h3>
                                <p className={themeClasses.mutedText}>You're about to book the following room</p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className={themeClasses.mutedText}>Hostel:</span>
                                        <span className="font-semibold text-white">{selectedHostel?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={themeClasses.mutedText}>Room:</span>
                                        <span className="font-semibold text-white">{selectedRoom?.number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={themeClasses.mutedText}>Type:</span>
                                        <span className="font-semibold capitalize text-white">{selectedRoom?.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={themeClasses.mutedText}>Price per semester:</span>
                                        <span className="font-bold text-indigo-400">₹{selectedRoom?.price?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-600 hover:text-white transition-all duration-200 border border-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowBookingModal(false);
                                        // Here you would typically call an API to book the room
                                        alert('Room booked successfully! (Mock booking)');
                                    }}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HostelSelection;