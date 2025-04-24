# Migration Guide: HTML to Astro

This guide documents how to migrate the remaining HTML pages to Astro format.

## Migration Steps

For each HTML file (blog_editor.html, waitlist_manager.html, etc.), follow these steps:

1. Create a new Astro page in `src/pages/` with kebab-case naming:

   - `blog_editor.html` → `blog-editor.astro`
   - `waitlist_manager.html` → `waitlist-manager.astro`
   - `user_management.html` → `user-management.astro`
   - `site_settings.html` → `site-settings.astro`

2. Use the AdminLayout component at the top of each file:

```astro
---
import AdminLayout from '../layouts/AdminLayout.astro';

// Any page-specific imports or logic here
---

<AdminLayout title="Page Title" currentPage="page-id">
  <!-- Main content from the HTML page -->
</AdminLayout>
```

3. Remove the following elements from the HTML content:

   - DOCTYPE, html, head, and body tags
   - Page meta, title, and CSS imports
   - Header and footer sections
   - Any navigation elements

4. Move page-specific styles to the Astro component:

```astro
<style>
  /* Page-specific styles here */
</style>
```

5. Convert any inline JavaScript to Astro script tags:

```astro
<script>
  // Client-side JavaScript here
</script>
```

6. For page-specific components, consider breaking them out into separate component files in `src/components/`.

## Example: Converting blog_editor.html

### Before:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blog Editor - ImpulsTrip Admin</title>
    <!-- CSS imports -->
    <style>
      /* Blog editor specific styles */
    </style>
  </head>
  <body>
    <!-- Header -->
    <header>...</header>

    <!-- Navigation -->
    <nav>...</nav>

    <!-- Main content -->
    <main>
      <div class="editor-container">...</div>
    </main>

    <!-- Footer -->
    <footer>...</footer>

    <!-- Scripts -->
    <script>
      ...
    </script>
  </body>
</html>
```

### After:

```astro
---
import AdminLayout from '../layouts/AdminLayout.astro';
---

<AdminLayout title="Blog Editor" currentPage="blog-editor">
  <div class="editor-container">
    <!-- Main content from the HTML file -->
  </div>
</AdminLayout>

<style>
  /* Blog editor specific styles */
</style>

<script>
  // Blog editor specific scripts
</script>
```

## Tips for Smooth Migration

1. **Test each page** after migration to ensure functionality is preserved
2. **Extract reusable components** when you notice repeated UI patterns
3. **Maintain API endpoints** to ensure data fetching works correctly
4. **Update navigation links** to point to the new Astro page paths
5. **Check authentication** is working across all pages

## API Compatibility

If you're using the Python backend server, ensure paths are consistent with the new Astro structure. Update the Python server to serve the Astro-built static files or consider replacing it with a Node-based server if needed.

## Benefits of Migration

- **Improved code organization**: Components, layouts, and pages are clearly separated
- **Better maintainability**: Smaller, focused files that are easier to update
- **Performance**: Astro's partial hydration optimizes client-side JavaScript
- **Type safety**: TypeScript integration helps catch errors early
