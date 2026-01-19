export const locations = [
  "Colombo",
  "Kandy",
  "Galle",
  "Negombo",
  "Jaffna",
  "Matara",
];

export const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

export const featuredCars = [
  {
    id: "sura-001",
    title: "Toyota Corolla Altis",
    brand: "Toyota",
    model: "Corolla Altis",
    year: 2022,
    fuelType: "Petrol",
    pricePerDay: 68,
    location: "Colombo",
    description:
      "Comfortable sedan with modern infotainment, reverse camera, and dual-zone climate control.",
    owner: {
      name: "Ayesha Perera",
      rating: 4.9,
      trips: 38,
    },
    images: ["/placeholder-car.svg", "/placeholder-car.svg", "/placeholder-car.svg"],
    availability: "Available from Jan 20",
  },
  {
    id: "sura-002",
    title: "Suzuki Wagon R Hybrid",
    brand: "Suzuki",
    model: "Wagon R",
    year: 2021,
    fuelType: "Hybrid",
    pricePerDay: 42,
    location: "Kandy",
    description:
      "Fuel-efficient city ride with spacious seating and Apple CarPlay support.",
    owner: {
      name: "Malith Jayawardena",
      rating: 4.8,
      trips: 21,
    },
    images: ["/placeholder-car.svg", "/placeholder-car.svg"],
    availability: "Available now",
  },
  {
    id: "sura-003",
    title: "Nissan X-Trail Premium",
    brand: "Nissan",
    model: "X-Trail",
    year: 2023,
    fuelType: "Diesel",
    pricePerDay: 96,
    location: "Galle",
    description:
      "SUV ready for coastal drives with panoramic sunroof and advanced safety features.",
    owner: {
      name: "Ravi Fonseka",
      rating: 4.7,
      trips: 15,
    },
    images: ["/placeholder-car.svg", "/placeholder-car.svg", "/placeholder-car.svg"],
    availability: "Available from Feb 2",
  },
  {
    id: "sura-004",
    title: "Tesla Model 3 Long Range",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    fuelType: "Electric",
    pricePerDay: 120,
    location: "Colombo",
    description:
      "Luxury EV with autopilot, fast charging access, and premium sound system.",
    owner: {
      name: "Sahan Fernando",
      rating: 5,
      trips: 12,
    },
    images: ["/placeholder-car.svg", "/placeholder-car.svg"],
    availability: "Limited availability",
  },
];

export const dashboardStats = [
  {
    label: "Active Listings",
    value: "3",
    description: "Cars currently live on the marketplace.",
  },
  {
    label: "Booking Requests",
    value: "5",
    description: "Pending approval in the last 7 days.",
  },
  {
    label: "Verification Status",
    value: "Pending",
    description: "Upload your license to unlock rentals.",
  },
];

export const adminQueue = [
  {
    id: "user-001",
    name: "Chamari Silva",
    document: "Driving license",
    status: "Pending",
  },
  {
    id: "car-001",
    name: "Honda Vezel 2021",
    document: "RC document",
    status: "Pending",
  },
  {
    id: "user-002",
    name: "Kasun Abeyratne",
    document: "Profile photo",
    status: "Pending",
  },
];
