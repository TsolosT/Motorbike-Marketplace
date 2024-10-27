
---

# MotorBike Marketplace App 🏍️

A feature-rich React application that allows users to buy, sell, and rent motorbikes. Built using Vite, Firebase, Swiper, and Leaflet, this app enables users to explore available motorbikes, view details and locations, and easily contact sellers or renters.

> This project is a **study case** from the Udemy course [React Front To Back](https://www.udemy.com/course/modern-react-front-to-back/) by Brad Traversy. It was built to practice React, modern JavaScript, Firebase & API interaction.

## Live Preview

Check out the live version of the app here: [Motorbike Marketplace on Vercel](https://motorbike-marketplace.vercel.app/)

## Table of Contents
- [MotorBike Marketplace App 🏍️](#motorbike-marketplace-app-️)
  - [Live Preview](#live-preview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Setup Instructions](#setup-instructions)
  - [Usage](#usage)
  - [Environment Variables](#environment-variables)
  - [License](#license)
  - [Contributing](#contributing)
  - [Acknowledgments](#acknowledgments)

## Features
- **Explore Listings**: Browse motorbikes available for rent or sale with pagination, loading 10 items at a time.
- **User Authentication**: Sign up and log in with email or Google OAuth.
- **Create and Edit Listings**: Users can create, edit, and delete listings for motorbikes, including details like price, location, and images.
- **Profile Management**: Edit profile information such as display name and log out.
- **Contact Owners**: Easily reach out to bike owners via a contact form.
- **Map Integration**: View the bike’s location on an interactive map powered by Leaflet.
- **Image Carousel**: Swipe through bike images using Swiper for a smooth carousel experience.

## Tech Stack
- **Frontend**: React (with Vite for fast development and builds), React Router for navigation, Leaflet for maps, and Swiper for image slides.
- **Backend**: Firebase Firestore for data storage, Firebase Authentication for user management.
- **UI Libraries**: React Toastify for notifications.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bike-marketplace-app.git
   cd bike-marketplace-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root directory and add the following environment variables (see [Environment Variables](#environment-variables) section below for more details):

   ```plaintext
   VITE_REACT_APP_GEOCODE_API_KEY=your_api_key
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Build the app for production:**
   ```bash
   npm run build
   ```

## Usage
- **Explore Listings**: Go to the home page to view all available motorbikes. Listings are paginated, loading 10 items at a time.
- **Create a Listing**: After signing in, users can create a new listing by navigating to the “Create Listing” page and filling out details about the bike.
- **Edit a Listing**: Users can edit their own listings by navigating to the “Edit Listing” page from their profile or listing page.
- **Contact a Seller/Renter**: On the listing details page, users can contact the listing owner directly.
- **Map View**: Each listing has an integrated map view showing the bike’s location.

## Environment Variables
To connect to Firebase, ensure the following variables are added to your `.env` file:

```plaintext
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace `your_firebase_api_key`, `your_auth_domain`, etc., with the respective values from your Firebase project settings.

## License
This project is licensed under the MIT License. Feel free to use and modify this project as per the terms of the license.

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. **Fork** the repository.
2. **Clone** your forked repo and create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes and push them to your fork.
4. **Create a Pull Request** to the main repository.

## Acknowledgments
- **Vite** for fast development builds.
- **Firebase** for seamless backend and authentication management.
- **Leaflet** for providing an easy-to-use map component.
- **Swiper** for creating a user-friendly image carousel.
- **React Toastify** for notifications.

---

Happy coding! 🎉
```

---
