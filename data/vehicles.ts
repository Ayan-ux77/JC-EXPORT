export type Vehicle = {
  id: number;
  slug: string;
  image: string;
  images: string[];

  brand: string;
  model: string;
  bodyType: string;

  year: number;
  title: string;
  mileage: string;
  mileageKm: number;

  engine: string;
  fuel: string;

  price: number;

  transmission: string;
  drivetrain: string;
  color: string;
  interior: string;
  steering: string;

  doors: number;
  seats: number;

  stock: string;
  location: string;

  freight: number;
  insurance: number;

  auctionGrade: number;
  condition: string;

  description: string;
};

export const vehicles: Vehicle[] = [
  {
    id: 1,
    slug: "mazda-axela-white-2018",
    image: "/cards/1.png",
    images: ["/cards/1.png", "/cards/1.png", "/cards/1.png"],

    brand: "Mazda",
    model: "Axela",
    bodyType: "Hatchback",

    year: 2018,
    title: "MAZDA AXELA WHITE",
    mileage: "104,000 km",
    mileageKm: 104000,

    engine: "2.0L",
    fuel: "Petrol",

    price: 3200,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Pearl White",
    interior: "Black Leather",
    steering: "Right-hand",

    doors: 5,
    seats: 5,

    stock: "MA-2026-0142",
    location: "Yokohama Yard",

    freight: 1800,
    insurance: 420,

    auctionGrade: 4.5,
    condition: "Used",

    description:
      "Excellent overall condition with verified auction report and full service history.",
  },

  {
    id: 2,
    slug: "toyota-corolla-black-2020",
    image: "/cards/2.png",
    images: ["/cards/2.png", "/cards/2.png", "/cards/2.png"],

    brand: "Toyota",
    model: "Corolla",
    bodyType: "Sedan",

    year: 2020,
    title: "TOYOTA COROLLA BLACK",
    mileage: "45,000 km",
    mileageKm: 45000,

    engine: "1.8L",
    fuel: "Hybrid",

    price: 4100,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Black",
    interior: "Black Fabric",
    steering: "Right-hand",

    doors: 4,
    seats: 5,

    stock: "TC-2026-0155",
    location: "Tokyo Yard",

    freight: 1700,
    insurance: 390,

    auctionGrade: 4.7,
    condition: "Used",

    description:
      "Low mileage hybrid vehicle with verified mileage and clean interior.",
  },

  {
    id: 3,
    slug: "honda-civic-silver-2019",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Honda",
    model: "Civic",
    bodyType: "Sedan",

    year: 2019,
    title: "HONDA CIVIC SILVER",
    mileage: "60,000 km",
    mileageKm: 60000,

    engine: "2.0L",
    fuel: "Petrol",

    price: 3700,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Silver",
    interior: "Black Leather",
    steering: "Right-hand",

    doors: 4,
    seats: 5,

    stock: "HC-2026-0188",
    location: "Osaka Yard",

    freight: 1650,
    insurance: 400,

    auctionGrade: 4.4,
    condition: "Used",

    description: "Well-maintained Honda Civic with a clean auction sheet.",
  },

  {
    id: 4,
    slug: "mazda-axela-white-2018-second",
    image: "/cards/4.png",
    images: ["/cards/4.png", "/cards/4.png", "/cards/4.png"],

    brand: "Mazda",
    model: "Axela",
    bodyType: "Hatchback",

    year: 2018,
    title: "MAZDA AXELA WHITE",
    mileage: "104,000 km",
    mileageKm: 104000,

    engine: "2.0L",
    fuel: "Petrol",

    price: 3300,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Pearl White",
    interior: "Black Leather",
    steering: "Right-hand",

    doors: 5,
    seats: 5,

    stock: "MA-2026-0211",
    location: "Yokohama Yard",

    freight: 1800,
    insurance: 420,

    auctionGrade: 4.3,
    condition: "Used",

    description:
      "Verified vehicle with clean documentation and export inspection.",
  },

  {
    id: 5,
    slug: "toyota-corolla-black-2020-second",
    image: "/cards/5.png",
    images: ["/cards/5.png", "/cards/5.png", "/cards/5.png"],

    brand: "Toyota",
    model: "Corolla",
    bodyType: "Sedan",

    year: 2020,
    title: "TOYOTA COROLLA BLACK",
    mileage: "45,000 km",
    mileageKm: 45000,

    engine: "1.8L",
    fuel: "Hybrid",

    price: 4200,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Black",
    interior: "Black Fabric",
    steering: "Right-hand",

    doors: 4,
    seats: 5,

    stock: "TC-2026-0225",
    location: "Tokyo Yard",

    freight: 1700,
    insurance: 390,

    auctionGrade: 4.6,
    condition: "Used",

    description:
      "Clean Toyota Corolla with verified mileage and inspection report.",
  },

  {
    id: 6,
    slug: "honda-civic-silver-2019-second",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Honda",
    model: "Civic",
    bodyType: "Sedan",

    year: 2019,
    title: "HONDA CIVIC SILVER",
    mileage: "60,000 km",
    mileageKm: 60000,

    engine: "2.0L",
    fuel: "Petrol",

    price: 3800,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Silver",
    interior: "Black Leather",
    steering: "Right-hand",

    doors: 4,
    seats: 5,

    stock: "HC-2026-0244",
    location: "Osaka Yard",

    freight: 1650,
    insurance: 400,

    auctionGrade: 4.2,
    condition: "Used",

    description: "Clean Honda Civic ready for export with verified paperwork.",
  },

  {
    id: 7,
    slug: "subaru-legacy-black-2013",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Subaru",
    model: "Legacy",
    bodyType: "Sedan",

    year: 2013,
    title: "SUBARU LEGACY BLACK",
    mileage: "82,000 km",
    mileageKm: 82000,

    engine: "2.5L",
    fuel: "Petrol",

    price: 4000,

    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Black",
    interior: "Black Fabric",
    steering: "Right-hand",

    doors: 4,
    seats: 5,

    stock: "SL-2026-0301",
    location: "Nagoya Yard",

    freight: 1750,
    insurance: 410,

    auctionGrade: 4.3,
    condition: "Used",

    description: "Clean Subaru Legacy with verified mileage.",
  },

  {
    id: 8,
    slug: "subaru-impreza-blue-2015",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Subaru",
    model: "Impreza",
    bodyType: "Hatchback",

    year: 2015,
    title: "SUBARU IMPREZA BLUE",
    mileage: "124,000 km",
    mileageKm: 124000,

    engine: "2.0L",
    fuel: "Petrol",

    price: 3100,

    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Blue",
    interior: "Black Fabric",
    steering: "Right-hand",

    doors: 5,
    seats: 5,

    stock: "SI-2026-0302",
    location: "Tokyo Yard",

    freight: 1700,
    insurance: 390,

    auctionGrade: 4.2,
    condition: "Used",

    description: "Reliable Subaru Impreza ready for export.",
  },

  {
    id: 9,
    slug: "lexus-ls-black-2016",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Lexus",
    model: "LS",
    bodyType: "Sedan",

    year: 2016,
    title: "LEXUS LS BLACK",
    mileage: "105,000 km",
    mileageKm: 105000,

    engine: "4.6L V8",
    fuel: "Petrol",

    price: 3900,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Black",
    interior: "Black Leather",
    steering: "Right-hand",

    doors: 4,
    seats: 5,

    stock: "LL-2026-0303",
    location: "Yokohama Yard",

    freight: 1900,
    insurance: 450,

    auctionGrade: 4.5,
    condition: "Used",

    description: "Luxury Lexus LS with complete inspection report.",
  },

  {
    id: 10,
    slug: "nissan-xtrail-white-2021",
    image: "/cards/1.png",
    images: ["/cards/1.png", "/cards/1.png", "/cards/1.png"],

    brand: "Nissan",
    model: "X-Trail",
    bodyType: "SUV",

    year: 2021,
    title: "NISSAN X-TRAIL WHITE",
    mileage: "38,000 km",
    mileageKm: 38000,

    engine: "2.0L",
    fuel: "Hybrid",

    price: 5800,

    transmission: "CVT",
    drivetrain: "4WD",
    color: "White",
    interior: "Black Leather",
    steering: "Right-hand",

    doors: 5,
    seats: 5,

    stock: "NX-2026-0304",
    location: "Tokyo Yard",

    freight: 1900,
    insurance: 470,

    auctionGrade: 4.8,
    condition: "Used",

    description:
      "Low mileage Nissan X-Trail with hybrid engine and four-wheel drive.",
  },

  {
    id: 11,
    slug: "suzuki-swift-red-2017",
    image: "/cards/2.png",
    images: ["/cards/2.png", "/cards/2.png", "/cards/2.png"],

    brand: "Suzuki",
    model: "Swift",
    bodyType: "Hatchback",

    year: 2017,
    title: "SUZUKI SWIFT RED",
    mileage: "72,000 km",
    mileageKm: 72000,

    engine: "1.2L",
    fuel: "Petrol",

    price: 2800,

    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Red",
    interior: "Black Fabric",
    steering: "Right-hand",

    doors: 5,
    seats: 5,

    stock: "SS-2026-0305",
    location: "Osaka Yard",

    freight: 1600,
    insurance: 360,

    auctionGrade: 4.1,
    condition: "Used",

    description:
      "Compact Suzuki Swift with good fuel economy and clean condition.",
  },

  {
    id: 12,
    slug: "toyota-land-cruiser-white-2022",
    image: "/cards/4.png",
    images: ["/cards/4.png", "/cards/4.png", "/cards/4.png"],

    brand: "Toyota",
    model: "Land Cruiser",
    bodyType: "SUV",

    year: 2022,
    title: "TOYOTA LAND CRUISER WHITE",
    mileage: "25,000 km",
    mileageKm: 25000,

    engine: "3.5L V6",
    fuel: "Petrol",

    price: 12500,

    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Pearl White",
    interior: "Beige Leather",
    steering: "Right-hand",

    doors: 5,
    seats: 7,

    stock: "TLC-2026-0306",
    location: "Yokohama Yard",

    freight: 2400,
    insurance: 650,

    auctionGrade: 4.9,
    condition: "Used",

    description:
      "Premium Toyota Land Cruiser with seven seats and excellent auction grade.",
  },
];
