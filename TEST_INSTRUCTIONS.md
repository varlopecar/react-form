# Frontend Testing Instructions

## 🎯 Testing the Frontend with Mock Data

The frontend is now configured to use mock data instead of making real API calls. This allows you to test all the visual components and user interactions without needing the backend services running.

## 🚀 How to Test

### 1. Start the Development Server

```bash
cd react-form
pnpm run dev
```

The app will be available at: **http://localhost:3000**

### 2. Test Credentials

You can use any email/password combination for testing. The mock service will automatically log you in as an admin user.

**Recommended test credentials:**

- Email: `admin@example.com`
- Password: `anypassword`

### 3. Features to Test

#### 📝 User Registration

- Navigate to `/register`
- Fill out the registration form
- Submit and see the success message
- The new user will be added to the mock database

#### 🔐 User Login

- Navigate to `/login`
- Use any email/password combination
- You'll be logged in as an admin user
- Redirected to the dashboard

#### 👥 User Management (Admin)

- After logging in, navigate to the dashboard
- View the list of users
- Test user deletion functionality
- Admin users can see full email addresses and birth dates
- Non-admin users see masked data

#### 📰 Blog Posts

- Navigate to the home page (`/`)
- View the list of blog posts
- Test the responsive grid layout
- Test blog post deletion (if implemented)

#### 🎨 UI/UX Testing

- Test responsive design on different screen sizes
- Test form validation
- Test error handling and success messages
- Test navigation between pages
- Test Material-UI components and styling

### 4. Mock Data

The app includes realistic mock data:

**Users:**

- 5 sample users including 1 admin
- Various cities and registration dates
- Realistic French names and locations

**Blog Posts:**

- 6 sample blog posts
- Topics: React, Docker, API Design, Testing, TypeScript
- French content for localization testing

### 5. Switching to Real API

To switch back to using the real API:

1. Edit `src/services/api.ts`
2. Change `const USE_MOCK = true;` to `const USE_MOCK = false;`
3. Make sure your backend services are running

### 6. Testing Checklist

- [ ] Registration form validation
- [ ] Login functionality
- [ ] User list display
- [ ] User deletion (admin only)
- [ ] Blog posts display
- [ ] Responsive design
- [ ] Navigation between pages
- [ ] Error handling
- [ ] Success messages
- [ ] Form reset after submission

## 🐛 Troubleshooting

If you encounter issues:

1. **Check the browser console** for any JavaScript errors
2. **Verify the dev server is running** on port 3000
3. **Clear browser cache** if needed
4. **Check that mock data is loading** by looking at the network tab

## 📱 Responsive Testing

Test the app on different screen sizes:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

The Grid component should automatically adjust the layout based on screen size.
