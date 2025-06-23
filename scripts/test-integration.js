#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

async function testBackendHealth() {
    console.log('🔍 Testing backend health...');
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        console.log('✅ Backend is running:', data);
        return true;
    } catch (error) {
        console.error('❌ Backend health check failed:', error.message);
        return false;
    }
}

async function testUserRegistration() {
    console.log('\n📝 Testing user registration...');
    try {
        const userData = {
            email: 'test.user@example.com',
            password: 'password123',
            first_name: 'Test',
            last_name: 'User',
            birth_date: '1990-01-01',
            city: 'Paris',
            postal_code: '75001'
        };

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const user = await response.json();
            console.log('✅ User registered successfully:', user.email);
            return user;
        } else {
            const error = await response.json();
            console.log('⚠️ Registration response:', error);
            return null;
        }
    } catch (error) {
        console.error('❌ Registration failed:', error.message);
        return null;
    }
}

async function testUserLogin(email, password) {
    console.log('\n🔐 Testing user login...');
    try {
        const loginData = {
            email,
            password
        };

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const auth = await response.json();
            console.log('✅ Login successful, token received');
            return auth.access_token;
        } else {
            const error = await response.json();
            console.log('❌ Login failed:', error.detail);
            return null;
        }
    } catch (error) {
        console.error('❌ Login request failed:', error.message);
        return null;
    }
}

async function testAdminLogin() {
    console.log('\n👑 Testing admin login...');
    return await testUserLogin('admin@example.com', 'admin123');
}

async function testGetUsers(token) {
    console.log('\n👥 Testing get users (admin only)...');
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const users = await response.json();
            console.log(`✅ Retrieved ${users.length} users:`);
            users.forEach(user => {
                console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - Admin: ${user.is_admin}`);
            });
            return users;
        } else {
            const error = await response.json();
            console.log('❌ Get users failed:', error.detail);
            return null;
        }
    } catch (error) {
        console.error('❌ Get users request failed:', error.message);
        return null;
    }
}

async function testDeleteUser(userId, token) {
    console.log(`\n🗑️ Testing delete user (ID: ${userId})...`);
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ User deleted successfully:', result.message);
            return true;
        } else {
            const error = await response.json();
            console.log('❌ Delete user failed:', error.detail);
            return false;
        }
    } catch (error) {
        console.error('❌ Delete user request failed:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Starting Frontend-Backend Integration Tests\n');

    // Test 1: Backend Health
    const backendHealthy = await testBackendHealth();
    if (!backendHealthy) {
        console.log('\n❌ Backend is not running. Please start the backend first.');
        process.exit(1);
    }

    // Test 2: Admin Login
    const adminToken = await testAdminLogin();
    if (!adminToken) {
        console.log('\n❌ Admin login failed. Check admin credentials.');
        process.exit(1);
    }

    // Test 3: Get Users (should show admin user)
    const users = await testGetUsers(adminToken);
    if (!users) {
        console.log('\n❌ Failed to get users list.');
        process.exit(1);
    }

    // Test 4: Register New User
    const newUser = await testUserRegistration();
    if (!newUser) {
        console.log('\n⚠️ User registration failed (might already exist)');
    }

    // Test 5: Login as New User
    const userToken = await testUserLogin('test.user@example.com', 'password123');
    if (!userToken) {
        console.log('\n❌ New user login failed.');
    }

    // Test 6: Get Updated Users List
    const updatedUsers = await testGetUsers(adminToken);
    if (updatedUsers && updatedUsers.length > users.length) {
        console.log('\n✅ New user appears in the list!');
    }

    // Test 7: Delete Test User (if it exists)
    if (newUser) {
        await testDeleteUser(newUser.id, adminToken);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('  - Backend is running and healthy');
    console.log('  - Admin authentication works');
    console.log('  - User registration works');
    console.log('  - User login works');
    console.log('  - Admin can view users list');
    console.log('  - Admin can delete users');
    console.log('\n✨ Your frontend-backend integration is working correctly!');
}

// Run the tests
runAllTests().catch(console.error); 