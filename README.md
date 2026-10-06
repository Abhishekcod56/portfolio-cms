# Portfolio CMS

Admin dashboard for managing the content of the portfolio website.

## Tech Stack

- Next.js
- React
- JavaScript
- Tailwind CSS
- Node.js / Express API
- MySQL

## Features

- Admin login
- Protected admin routes
- Dashboard
- About management
- Skills management
- Projects management
- Experience management
- Services management
- Testimonials management
- Blog management
- Contact message management
- Image upload
- Admin password change
- Logout
- Responsive admin sidebar
- Toast notifications
- Confirmation dialogs

## Project Structure

```text
cms/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── about/
│   │   │   ├── skills/
│   │   │   ├── projects/
│   │   │   ├── experience/
│   │   │   ├── services/
│   │   │   ├── testimonials/
│   │   │   ├── blogs/
│   │   │   ├── messages/
│   │   │   ├── media/
│   │   │   ├── settings/
│   │   │   └── layout.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/
│   │   ├── AdminAuthGuard.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── Toast.jsx
│   │
│   └── lib/
│       ├── api.js
│       ├── authApi.js
│       ├── aboutApi.js
│       ├── skillApi.js
│       ├── projectApi.js
│       ├── experienceApi.js
│       ├── serviceApi.js
│       ├── testimonialApi.js
│       ├── blogApi.js
│       ├── messageApi.js
│       └── mediaApi.js
│
├── .env.local
├── package.json
└── README.md