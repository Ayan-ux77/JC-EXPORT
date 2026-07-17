export type Vehicle = {
  id: number;

  slug: string;

  image: string;

  images: string[];

  brand: string;

  year: number;

  title: string;

  mileage: string;

  engine: string;

  fuel: string;

  price: string;

  transmission: string;

  drivetrain: string;

  color: string;

  interior: string;

  steering: string;

  stock: string;

  location: string;

  freight: string;

  insurance: string;

  auctionGrade: string;

  description: string;
};

export const vehicles: Vehicle[] = [
  {
    id: 1,

    slug: "mazda-axela-white-2018",

    image: "/cards/1.png",

    images: ["/cards/1.png", "/cards/1.png", "/cards/1.png"],

    brand: "Mazda",

    year: 2018,

    title: "MAZDA AXELA WHITE",

    mileage: "104,000 km",

    engine: "4.6L V8",

    fuel: "Petrol",

    price: "3,200",

    transmission: "Automatic",

    drivetrain: "2WD",

    color: "Pearl White",

    interior: "Black Leather",

    steering: "Right-hand",

    stock: "MA-2026-0142",

    location: "Yokohama Yard",

    freight: "1,800",

    insurance: "420",

    auctionGrade: "4.5 / 5",

    description:
      "Excellent overall condition with verified auction report and full service history.",
  },

  {
    id: 2,

    slug: "toyota-corolla-black-2020",

    image: "/cards/2.png",

    images: ["/cards/2.png", "/cards/2.png", "/cards/2.png"],

    brand: "Toyota",

    year: 2020,

    title: "TOYOTA COROLLA BLACK",

    mileage: "45,000 km",

    engine: "1.8L",

    fuel: "Hybrid",

    price: "4,100",

    transmission: "Automatic",

    drivetrain: "2WD",

    color: "Black",

    interior: "Black Fabric",

    steering: "Right-hand",

    stock: "TC-2026-0155",

    location: "Tokyo Yard",

    freight: "1,700",

    insurance: "390",

    auctionGrade: "4.7 / 5",

    description:
      "Low mileage hybrid vehicle with verified mileage and clean interior.",
  },

  {
    id: 3,

    slug: "honda-civic-silver-2019",

    image: "/cards/3.png",

    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Honda",

    year: 2019,

    title: "HONDA CIVIC SILVER",

    mileage: "60,000 km",

    engine: "2.0L",

    fuel: "Petrol",

    price: "3,700",

    transmission: "Automatic",

    drivetrain: "2WD",

    color: "Silver",

    interior: "Black Leather",

    steering: "Right-hand",

    stock: "HC-2026-0188",

    location: "Osaka Yard",

    freight: "1,650",

    insurance: "400",

    auctionGrade: "4.4 / 5",

    description: "Well-maintained Honda Civic with a clean auction sheet.",
  },

  {
    id: 4,

    slug: "mazda-axela-white-2018-second",

    image: "/cards/4.png",

    images: ["/cards/4.png", "/cards/4.png", "/cards/4.png"],

    brand: "Mazda",

    year: 2018,

    title: "MAZDA AXELA WHITE",

    mileage: "104,000 km",

    engine: "4.6L V8",

    fuel: "Petrol",

    price: "3,200",

    transmission: "Automatic",

    drivetrain: "2WD",

    color: "Pearl White",

    interior: "Black Leather",

    steering: "Right-hand",

    stock: "MA-2026-0211",

    location: "Yokohama Yard",

    freight: "1,800",

    insurance: "420",

    auctionGrade: "4.3 / 5",

    description:
      "Verified vehicle with clean documentation and export inspection.",
  },

  {
    id: 5,

    slug: "toyota-corolla-black-2020-second",

    image: "/cards/5.png",

    images: ["/cards/5.png", "/cards/5.png", "/cards/5.png"],

    brand: "Toyota",

    year: 2020,

    title: "TOYOTA COROLLA BLACK",

    mileage: "45,000 km",

    engine: "1.8L",

    fuel: "Hybrid",

    price: "4,100",

    transmission: "Automatic",

    drivetrain: "2WD",

    color: "Black",

    interior: "Black Fabric",

    steering: "Right-hand",

    stock: "TC-2026-0225",

    location: "Tokyo Yard",

    freight: "1,700",

    insurance: "390",

    auctionGrade: "4.6 / 5",

    description:
      "Clean Toyota Corolla with verified mileage and inspection report.",
  },

  {
    id: 6,

    slug: "honda-civic-silver-2019-second",

    image: "/cards/3.png",

    images: ["/cards/3.png", "/cards/3.png", "/cards/3.png"],

    brand: "Honda",

    year: 2019,

    title: "HONDA CIVIC SILVER",

    mileage: "60,000 km",

    engine: "2.0L",

    fuel: "Petrol",

    price: "3,700",

    transmission: "Automatic",

    drivetrain: "2WD",

    color: "Silver",

    interior: "Black Leather",

    steering: "Right-hand",

    stock: "HC-2026-0244",

    location: "Osaka Yard",

    freight: "1,650",

    insurance: "400",

    auctionGrade: "4.2 / 5",

    description: "Clean Honda Civic ready for export with verified paperwork.",
  },
  {
    id: 7,
    slug: "subaru-legacy-black-2013",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png"],
    brand: "Subaru",
    year: 2013,
    title: "SUBARU LEGACY BLACK",
    mileage: "82,000 km",
    engine: "2.5L",
    fuel: "Petrol",
    price: "4,000",
    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Black",
    interior: "Black Fabric",
    steering: "Right-hand",
    stock: "SL-2026-0301",
    location: "Nagoya Yard",
    freight: "1,750",
    insurance: "410",
    auctionGrade: "4.3 / 5",
    description: "Clean Subaru Legacy with verified mileage.",
  },
  {
    id: 8,
    slug: "subaru-impreza-blue-2015",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png"],
    brand: "Subaru",
    year: 2015,
    title: "SUBARU IMPREZA BLUE",
    mileage: "124,000 km",
    engine: "2.0L",
    fuel: "Petrol",
    price: "3,100",
    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Blue",
    interior: "Black Fabric",
    steering: "Right-hand",
    stock: "SI-2026-0302",
    location: "Tokyo Yard",
    freight: "1,700",
    insurance: "390",
    auctionGrade: "4.2 / 5",
    description: "Reliable Subaru Impreza ready for export.",
  },
  {
    id: 9,
    slug: "lexus-ls-black-2016",
    image: "/cards/3.png",
    images: ["/cards/3.png", "/cards/3.png"],
    brand: "Lexus",
    year: 2016,
    title: "LEXUS LS BLACK",
    mileage: "105,000 km",
    engine: "4.6L V8",
    fuel: "Petrol",
    price: "3,900",
    transmission: "Automatic",
    drivetrain: "2WD",
    color: "Black",
    interior: "Black Leather",
    steering: "Right-hand",
    stock: "LL-2026-0303",
    location: "Yokohama Yard",
    freight: "1,900",
    insurance: "450",
    auctionGrade: "4.5 / 5",
    description: "Luxury Lexus LS with complete inspection report.",
  },
];
