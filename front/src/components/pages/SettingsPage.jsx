import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { themeClasses, iconClasses } from '../../styles/theme';

const SettingsPage = ({ userRole = 'student' }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState({
        profile: {
            name: '',
            email: '',
            phone: '',
            address: '',
            bio: '',
            profileImage: null
        },
        security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            twoFactorEnabled: false,
            loginAlerts: true
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            announcements: true,
            reminders: true,
            grades: true,
            attendance: true,
            events: true,
            assignments: true,
            library: false
        },
        preferences: {
            theme: 'dark',
            language: 'en',
            timezone: 'Asia/Kolkata',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'INR',
            defaultDashboard: 'overview'
        },
        privacy: {
            profileVisibility: 'institute',
            showEmail: false,
            showPhone: false,
            dataSharing: false,
            analyticsConsent: true,
            marketingConsent: false
        },
        academic: {
            semester: '',
            branch: '',
            rollNumber: '',
            section: '',
            mentor: '',
            subjects: []
        },
        system: {
            autoBackup: true,
            maintenanceMode: false,
            debugMode: false,
            logLevel: 'info',
            sessionTimeout: 30,
            maxLoginAttempts: 5
        }
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Role-based tab configuration
    const getTabsForRole = (role) => {
        const baseTabs = [
            { id: 'profile', label: 'Profile', icon: 'ri-user-line' },
            { id: 'security', label: 'Security', icon: 'ri-shield-line' },
            { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
            { id: 'preferences', label: 'Preferences', icon: 'ri-settings-line' },
            { id: 'privacy', label: 'Privacy', icon: 'ri-eye-line' }
        ];

        const roleTabs = {
            admin: [
                ...baseTabs,
                { id: 'system', label: 'System', icon: 'ri-server-line' }
            ],
            teacher: [
                ...baseTabs,
                { id: 'academic', label: 'Academic', icon: 'ri-book-line' }
            ],
            student: [
                ...baseTabs,
                { id: 'academic', label: 'Academic', icon: 'ri-graduation-cap-line' }
            ],
            clerk: baseTabs
        };

        return roleTabs[role] || baseTabs;
    };

    const tabs = getTabsForRole(userRole);

    // Mock data loading
    useEffect(() => {
        // Load user settings from localStorage or API
        const savedSettings = localStorage.getItem(`settings_${userRole}`);
        if (savedSettings) {
            setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
    }, [userRole]);

    const handleInputChange = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSave = async (category) => {
        setLoading(true);
        try {
            // Save to localStorage (in real app, save to API)
            localStorage.setItem(`settings_${userRole}`, JSON.stringify(settings));
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('profile', 'profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetToDefaults = (category) => {
        if (window.confirm('Are you sure you want to reset these settings to default values?')) {
            // Reset specific category to defaults
            const defaults = {
                notifications: {
                    emailNotifications: true,
                    pushNotifications: true,
                    smsNotifications: false,
                    announcements: true,
                    reminders: true,
                    grades: true,
                    attendance: true,
                    events: true,
                    assignments: true,
                    library: false
                },
                preferences: {
                    theme: 'dark',
                    language: 'en',
                    timezone: 'Asia/Kolkata',
                    dateFormat: 'DD/MM/YYYY',
                    timeFormat: '24h',
                    currency: 'INR',
                    defaultDashboard: 'overview'
                },
                privacy: {
                    profileVisibility: 'institute',
                    showEmail: false,
                    showPhone: false,
                    dataSharing: false,
                    analyticsConsent: true,
                    marketingConsent: false
                }
            };

            if (defaults[category]) {
                setSettings(prev => ({
                    ...prev,
                    [category]: defaults[category]
                }));
            }
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {settings.profile.profileImage ? (
                            <img
                                src={settings.profile.profileImage}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            settings.profile.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                        <i className="ri-camera-line text-sm"></i>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>
                <div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                        Profile Picture
                    </h3>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                        Upload a profile picture to personalize your account
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                        placeholder="Enter your full name"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Address
                    </label>
                    <input
                        type="text"
                        value={settings.profile.address}
                        onChange={(e) => handleInputChange('profile', 'address', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                        placeholder="Enter your address"
                    />
                </div>
            </div>

            <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Bio
                </label>
                <textarea
                    value={settings.profile.bio}
                    onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    placeholder="Tell us about yourself"
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('profile')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-save-line"></i>
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                    Change Password
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={settings.security.currentPassword}
                            onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={settings.security.newPassword}
                                onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={settings.security.confirmPassword}
                                onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                    Security Options
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                Two-Factor Authentication
                            </label>
                            <p className={`text-xs ${themeClasses.text.secondary}`}>
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.security.twoFactorEnabled}
                                onChange={(e) => handleInputChange('security', 'twoFactorEnabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                Login Alerts
                            </label>
                            <p className={`text-xs ${themeClasses.text.secondary}`}>
                                Get notified when someone logs into your account
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.security.loginAlerts}
                                onChange={(e) => handleInputChange('security', 'loginAlerts', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('security')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Updating...
                        </>
                    ) : (
                        <>
                            <i className="ri-shield-check-line"></i>
                            Update Security
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                    Notification Preferences
                </h3>
                <button
                    onClick={() => resetToDefaults('notifications')}
                    className={`text-sm ${themeClasses.text.secondary} hover:text-indigo-400 transition-colors`}
                >
                    Reset to defaults
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className={`font-medium ${themeClasses.text.primary} mb-4`}>
                        Communication Methods
                    </h4>
                    <div className="space-y-3">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser and mobile notifications' },
                            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Text message alerts' }
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                        {item.label}
                                    </label>
                                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                                        {item.desc}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications[item.key]}
                                        onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className={`font-medium ${themeClasses.text.primary} mb-4`}>
                        Content Types
                    </h4>
                    <div className="space-y-3">
                        {[
                            { key: 'announcements', label: 'Announcements', desc: 'Important notices and updates' },
                            { key: 'reminders', label: 'Reminders', desc: 'Deadline and event reminders' },
                            { key: 'grades', label: 'Grades', desc: 'Grade updates and results' },
                            { key: 'attendance', label: 'Attendance', desc: 'Attendance related notifications' },
                            { key: 'events', label: 'Events', desc: 'Upcoming events and activities' },
                            { key: 'assignments', label: 'Assignments', desc: 'Assignment notifications' },
                            { key: 'library', label: 'Library', desc: 'Library due dates and holds' }
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                        {item.label}
                                    </label>
                                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                                        {item.desc}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications[item.key]}
                                        onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('notifications')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-notification-check-line"></i>
                            Save Preferences
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                    System Preferences
                </h3>
                <button
                    onClick={() => resetToDefaults('preferences')}
                    className={`text-sm ${themeClasses.text.secondary} hover:text-indigo-400 transition-colors`}
                >
                    Reset to defaults
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Theme
                    </label>
                    <select
                        value={settings.preferences.theme}
                        onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Language
                    </label>
                    <select
                        value={settings.preferences.language}
                        onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="bn">Bengali</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Timezone
                    </label>
                    <select
                        value={settings.preferences.timezone}
                        onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Date Format
                    </label>
                    <select
                        value={settings.preferences.dateFormat}
                        onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Time Format
                    </label>
                    <select
                        value={settings.preferences.timeFormat}
                        onChange={(e) => handleInputChange('preferences', 'timeFormat', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="24h">24 Hour</option>
                        <option value="12h">12 Hour (AM/PM)</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Currency
                    </label>
                    <select
                        value={settings.preferences.currency}
                        onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('preferences')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-settings-check-line"></i>
                            Save Preferences
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                    Privacy Settings
                </h3>
                <button
                    onClick={() => resetToDefaults('privacy')}
                    className={`text-sm ${themeClasses.text.secondary} hover:text-indigo-400 transition-colors`}
                >
                    Reset to defaults
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Profile Visibility
                    </label>
                    <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="public">Public</option>
                        <option value="institute">Institute Only</option>
                        <option value="private">Private</option>
                    </select>
                    <p className={`text-xs ${themeClasses.text.secondary} mt-1`}>
                        Control who can see your profile information
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>
                        Contact Information Visibility
                    </h4>
                    
                    {[
                        { key: 'showEmail', label: 'Show Email Address', desc: 'Allow others to see your email address' },
                        { key: 'showPhone', label: 'Show Phone Number', desc: 'Allow others to see your phone number' }
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                    {item.label}
                                </label>
                                <p className={`text-xs ${themeClasses.text.secondary}`}>
                                    {item.desc}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy[item.key]}
                                    onChange={(e) => handleInputChange('privacy', item.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>
                        Data & Analytics
                    </h4>
                    
                    {[
                        { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for research purposes' },
                        { key: 'analyticsConsent', label: 'Analytics', desc: 'Help improve our services with usage analytics' },
                        { key: 'marketingConsent', label: 'Marketing Communications', desc: 'Receive promotional emails and updates' }
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                    {item.label}
                                </label>
                                <p className={`text-xs ${themeClasses.text.secondary}`}>
                                    {item.desc}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy[item.key]}
                                    onChange={(e) => handleInputChange('privacy', item.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('privacy')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-eye-check-line"></i>
                            Save Privacy Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderAcademicTab = () => (
        <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                Academic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRole === 'student' ? (
                    <>
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Roll Number
                            </label>
                            <input
                                type="text"
                                value={settings.academic.rollNumber}
                                onChange={(e) => handleInputChange('academic', 'rollNumber', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Enter roll number"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Branch
                            </label>
                            <select
                                value={settings.academic.branch}
                                onChange={(e) => handleInputChange('academic', 'branch', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">Computer Science Engineering</option>
                                <option value="ECE">Electronics & Communication</option>
                                <option value="ME">Mechanical Engineering</option>
                                <option value="CE">Civil Engineering</option>
                                <option value="EE">Electrical Engineering</option>
                                <option value="IT">Information Technology</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Semester
                            </label>
                            <select
                                value={settings.academic.semester}
                                onChange={(e) => handleInputChange('academic', 'semester', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                            >
                                <option value="">Select Semester</option>
                                {Array.from({ length: 8 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Section
                            </label>
                            <select
                                value={settings.academic.section}
                                onChange={(e) => handleInputChange('academic', 'section', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                            >
                                <option value="">Select Section</option>
                                <option value="A">Section A</option>
                                <option value="B">Section B</option>
                                <option value="C">Section C</option>
                                <option value="D">Section D</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Academic Mentor
                            </label>
                            <input
                                type="text"
                                value={settings.academic.mentor}
                                onChange={(e) => handleInputChange('academic', 'mentor', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Enter mentor name"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Employee ID
                            </label>
                            <input
                                type="text"
                                value={settings.academic.employeeId}
                                onChange={(e) => handleInputChange('academic', 'employeeId', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Enter employee ID"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Department
                            </label>
                            <select
                                value={settings.academic.department}
                                onChange={(e) => handleInputChange('academic', 'department', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">Computer Science Engineering</option>
                                <option value="ECE">Electronics & Communication</option>
                                <option value="ME">Mechanical Engineering</option>
                                <option value="CE">Civil Engineering</option>
                                <option value="EE">Electrical Engineering</option>
                                <option value="IT">Information Technology</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Designation
                            </label>
                            <input
                                type="text"
                                value={settings.academic.designation}
                                onChange={(e) => handleInputChange('academic', 'designation', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Enter designation"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                Experience (Years)
                            </label>
                            <input
                                type="number"
                                value={settings.academic.experience}
                                onChange={(e) => handleInputChange('academic', 'experience', e.target.value)}
                                className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                placeholder="Enter experience"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('academic')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-graduation-cap-line"></i>
                            Save Academic Info
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderSystemTab = () => (
        <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                System Administration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Log Level
                    </label>
                    <select
                        value={settings.system.logLevel}
                        onChange={(e) => handleInputChange('system', 'logLevel', e.target.value)}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                    >
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Session Timeout (minutes)
                    </label>
                    <input
                        type="number"
                        value={settings.system.sessionTimeout}
                        onChange={(e) => handleInputChange('system', 'sessionTimeout', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                        min="5"
                        max="480"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Max Login Attempts
                    </label>
                    <input
                        type="number"
                        value={settings.system.maxLoginAttempts}
                        onChange={(e) => handleInputChange('system', 'maxLoginAttempts', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                        min="3"
                        max="10"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h4 className={`font-medium ${themeClasses.text.primary}`}>
                    System Options
                </h4>
                
                {[
                    { key: 'autoBackup', label: 'Automatic Backups', desc: 'Enable automatic daily backups' },
                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put system in maintenance mode' },
                    { key: 'debugMode', label: 'Debug Mode', desc: 'Enable debug logging and error reporting' }
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                        <div>
                            <label className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                {item.label}
                            </label>
                            <p className={`text-xs ${themeClasses.text.secondary}`}>
                                {item.desc}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.system[item.key]}
                                onChange={(e) => handleInputChange('system', item.key, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => handleSave('system')}
                    disabled={loading}
                    className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="ri-server-check-line"></i>
                            Save System Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab();
            case 'security':
                return renderSecurityTab();
            case 'notifications':
                return renderNotificationsTab();
            case 'preferences':
                return renderPreferencesTab();
            case 'privacy':
                return renderPrivacyTab();
            case 'academic':
                return renderAcademicTab();
            case 'system':
                return renderSystemTab();
            default:
                return renderProfileTab();
        }
    };

    return (
        <div className={`min-h-screen ${themeClasses.background} p-6`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
                        Settings
                    </h1>
                    <p className={`${themeClasses.text.secondary}`}>
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Success/Error Message */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            message.type === 'success'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                    >
                        <i className={`${message.type === 'success' ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                        {message.text}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className={`${themeClasses.primaryCard} p-6 rounded-lg h-fit`}>
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === tab.id
                                            ? `${themeClasses.button.primary} text-white`
                                            : `${themeClasses.text.secondary} hover:bg-gray-700 hover:text-gray-100`
                                    }`}
                                >
                                    <i className={tab.icon}></i>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className={`${themeClasses.primaryCard} p-6 rounded-lg`}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderTabContent()}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;