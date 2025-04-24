# IMPULS Trip Admin Dashboard

This is the admin dashboard for managing the IMPULS Trip website content and users.

## Setup

1. Clone this repository:
```bash
git clone https://github.com/TejeshwarThakur2003/ImpulsTripWS-Admin.git
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PUBLIC_API_URL=http://localhost:8001
PORT=8082
NODE_ENV=development
```

Adjust the `PUBLIC_API_URL` to point to your backend server.

## Development

Start the development server:
```bash
npm run dev
```

This will start the Astro development server on port 8082 (or the port specified in your .env file).

## Building for Production

```bash
npm run build
```

## Connection with Other Projects

### Backend Integration

The admin dashboard connects to the IMPULS Trip backend for API requests. To connect properly:

1. Ensure the backend server is running on the URL specified in your `.env` file.
2. Make sure the backend server has CORS configured to allow requests from your admin dashboard domain.
3. API requests should be made to `${import.meta.env.PUBLIC_API_URL}/...`

### Authentication

The admin dashboard uses JWT authentication with the backend:

1. Authenticate using the `/admin/auth/login` endpoint on the backend.
2. Store the JWT token securely in the browser.
3. Include the token in the Authorization header for authenticated requests.

## Creating a New Git Repository

To create a separate git repository for this project:

1. Initialize a new git repository:
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Commit the files:
```bash
git commit -m "Initial commit for IMPULS Trip admin dashboard"
```

4. Add your remote repository:
```bash
git remote add origin https://github.com/TejeshwarThakur2003/ImpulsTripWS-Admin.git
```

5. Push to your remote repository:
```bash
git push -u origin main
```

## Project Structure

```
/
├── public/
│   └── img/        # Static images
├── src/
│   ├── components/ # Reusable UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Navigation.astro
│   ├── layouts/    # Page layouts
│   │   └── AdminLayout.astro
│   ├── pages/      # Routes
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── dashboard.astro
│   │   ├── blog-editor.astro
│   │   ├── waitlist-manager.astro
│   │   ├── user-management.astro
│   │   └── site-settings.astro
│   └── styles/     # Global styles
│       └── global.css
└── package.json
```

## Features

- Content management for blog posts
- Image upload and management
- Waitlist/newsletter subscriber management
- Analytics dashboard
- User management
- Site settings

## Deployment

Deploy the contents of the `dist/` directory to your preferred hosting service.

## Development Guidelines

### Adding New Pages

1. Create a new `.astro` file in the `src/pages/` directory
2. Use the `AdminLayout` component:

```astro
---
import AdminLayout from '../layouts/AdminLayout.astro';
---

<AdminLayout title="Page Title" currentPage="page-id">
  <!-- Page content goes here -->
</AdminLayout>
```

### Adding New Components

1. Create a new `.astro` file in the `src/components/` directory
2. Export props if needed:

```astro
---
interface Props {
  myProp: string;
}

const { myProp } = Astro.props;
---

<div>
  <p>{myProp}</p>
</div>
```

### Styling

- Global styles are in `src/styles/global.css`
- Component-specific styles can be added within the component files

# Blog Management System

This is an admin interface for managing blog posts on the ImpulsTrip website. It allows you to create, edit, and delete blog posts with rich content and images.

## Features

- Admin-only access (login required)
- Create new blog posts with:
  - Title, tagline, and author information
  - Cover image
  - Rich content with Markdown support
  - Inline images with automatic uploading
- Edit existing blog posts
- Delete blog posts
- Live content preview
- Responsive design

## Getting Started

### Prerequisites

- Backend server running on port 8000
- Admin credentials (username and password)

### Running the Admin Dashboard

1. Start the backend server:

   ```
   cd backend
   python main.py
   ```

2. Start the admin dashboard:

   ```
   cd admin-dashboard
   python run_dashboard.py
   ```

3. The dashboard should automatically open in your browser at http://localhost:8080/blog_editor.html

4. Log in with your admin credentials

## Using the Blog Manager

### Creating a New Blog Post

1. Click on the "New Post" tab
2. Fill in all required fields:
   - Title: The main title of your blog post
   - Tagline: A brief summary or subtitle
   - Author: The name of the person who wrote the post
   - Content: The main body of your blog post (supports Markdown)
3. Optionally, upload a cover image
4. Optionally, upload inline images to be used in your content
5. Use the preview pane to see how your content will look
6. Click "Create Post" to publish your blog post

### Editing a Blog Post

1. On the "All Posts" tab, find the post you want to edit and click "Edit"
2. Update the fields as needed
3. You can choose to replace the cover image by uploading a new one
4. You can add more inline images or replace all existing ones
5. Use the preview pane to see your changes
6. Click "Update Post" to save your changes

### Deleting a Blog Post

1. On the "All Posts" tab, find the post you want to delete and click "Edit"
2. On the edit page, click the "Delete Post" button
3. Confirm the deletion when prompted

## Content Guidelines

### Markdown Support

The content editor supports Markdown formatting:

- `# Heading 1`, `## Heading 2`, etc. for headings
- `*italic*` or `_italic_` for italic text
- `**bold**` or `__bold__` for bold text
- `- Item` for bullet lists
- `1. Item` for numbered lists
- `[Link text](https://example.com)` for links
- `![Alt text](imageN)` to insert uploaded images, where N is the image number

### Using Inline Images

1. Upload your images using the "Inline Images" field
2. Reference them in your content using the format `![Alt text](image1)`, `![Alt text](image2)`, etc.
3. The images will be replaced with the actual uploaded images when displayed

## Troubleshooting

- If you can't log in, make sure the backend server is running
- If images don't appear, check that they were uploaded successfully
- If the preview doesn't update, try refreshing the page
