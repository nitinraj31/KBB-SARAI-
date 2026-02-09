# TODO: Make 50+ Changes to AgriMarket

## Tasks to Complete
- [ ] Add 50+ products to database.js seed data (already 50, add more to make 100+)
- [ ] Update public/index.html to fetch categories and products from API
- [ ] Implement search functionality in frontend
- [ ] Add functional login/registration forms
- [ ] Add cart functionality (add to cart, view cart, remove items)
- [ ] Add orders functionality (place order, view orders)
- [ ] Add admin panel for managing products/categories
- [ ] Update styles.css for new components if needed
- [ ] Test all new features and API integrations
- [ ] Ensure responsive design for new features

## Progress
- Started: [Date/Time]
- Completed:

## Detailed Steps
1. Add more products to database.js seed data.
2. Update index.html to fetch categories from /api/categories.
3. Update index.html to fetch products from /api/products.
4. Implement search: add search input that fetches /api/products/search?query=...
5. Update LoginCard to handle registration via /api/auth/register.
6. Store JWT token in localStorage after login/register.
7. Add cart state management (use React state).
8. Update ProductCard to add to cart functionality.
9. Add cart section in header or separate page.
10. Add place order functionality for logged-in users.
11. Add view orders for users.
12. Add admin login with password "admin".
13. Create admin panel to manage products: list, add, edit, delete.
14. Create admin panel to manage categories: list, add, edit, delete.
15. Update styles for new components.
16. Test login, cart, orders, admin.
17. Ensure responsive.
