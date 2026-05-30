export const ticketSource = {
  title: "Woodlands Park Tickets",
  url: "https://www.woodlandspark.com/your-visit/information/tickets/",
  modified: "2026-01-14T13:57:15",
  image: "home-hero.jpg",
  alt: "Woodlands tickets and admission information",
};

export const ticketIntro = [
  "Woodlands 2025 Ticketing Information",
  "Planning your visit? See below for details on our prices and opening schedule throughout the season.",
];

export const wristbandInformation = [
  "7-Day Wristbands Information",
  "7-Day wristbands can be prebooked online for use between select dates during the Main Season and Summer Holidays.",
  "If you decide you would like to extend the Woodlands fun to a week, Main Season/Summer Holiday Tickets purchased online can be upgraded to 7-Day Wristbands on the day. The difference between the discounted rate paid online and the gate price must be paid when upgrading at the entrance kiosk.",
  "Main Season/Summer Holiday Tickets purchased at the entrance gate on the day can be upgraded to 7-Day Wristbands at no extra cost.",
  "Visit our opening times page to see which rides are open and our daily opening hours.",
];

export const ticketTerms = [
  {
    title: "Children Under 17",
    body: "All children under the age of 17 must be accompanied by an adult. Identification for proof of age may be requested by entrance gate attendants if you look under 18.",
  },
  {
    title: "Non Refundable",
    body: "Tickets bought online are non-refundable for any reason.",
  },
  {
    title: "Changing Your Ticket Date",
    body: "Tickets are dated tickets and are only valid on the date which is booked.\nIf you wish to change your visit date this needs to be done 24 hours before your visit and a \u00a35 charge applies. You will need to call Woodlands Reception Team on 01803 712598 who will be able to change your ticket for a fee of \u00a35 per booking number.",
  },
  {
    title: "Guests With Disabilities",
    body: "We welcome visits from guests with disabilities and do everything possible to ensure a safe and pleasurable visit. We do need to make you aware that due to our valley location we do have steep hills on the site. Apologies but we do not have any wheelchairs available for hire.\nWe offer a reduced rate for guests with disabilities visiting Woodlands Family Theme Park. Please visit our Ticket page for more information. In order to purchase a ticket documentary evidence will be required at the admission kiosk to qualify for the reduced price. Please bring along one of the below:\nDLA Letter\nPIP Letter\nBlue Badge\nNational Disabled ID Card\nNimbus Access Card",
  },
  {
    title: "Discount Vouchers",
    body: "Discount Coupons/Vouchers cannot be redeemed against online tickets. Any discount vouchers presented at admission will receive the discount taken off the individual admission price on the gate, not the online price, as online tickets are already 10%-30% off and no special offer can be used in conjunction with any other special offer.\nDiscount Coupons/Vouchers are not valid during the winter fun or off peak term time seasons.",
  },
  {
    title: "Carers Tickets",
    body: "We do not offer free entry for carers instead we offer a high discounted price for the Guest with Disabilities. To book your tickets please visit our online ticket page.",
  },
  {
    title: "Upgrading Tickets on the Day",
    body: "7 Day Wristband Ticket: 6 Days Free\nUpgrade your ticket on the day to a '7 Day Wristband' to come back for the next 6 consecutive days*.\nPay the standard individual gate admission price during the Main Season/Summer Holiday Season and you will get the next 6 days FREE!\nBooked your tickets online at the discounted price? The cost to upgrade will be the difference between the price you paid per person and the standard individual gate admission price.\nThis needs to be done on the day of your visit and you must have your printed/online receipt.\nNot available during Off-Peak Weekdays or Winter Opening\nAnnual Membership Ticket Upgrade\nGet the entrance price of your day visit taken off the cost of an Annual Pass when you upgrade on the day.\nThis needs to be done on the day the ticket was bought/redeemed and you must have your printed/online receipt.\nPlease ask at the entrance kiosk for T&Cs.\nNot in conjunction with any other offers.",
  },
];

export const ticketTypeSeedData = [
  {
    id: "family",
    name: "Family Ticket",
    description:
      "Ticket option for families visiting Woodlands. Live prices must be verified from the approved booking system before production.",
    priceLabel: "Price to be confirmed",
  },
  {
    id: "individual",
    name: "Individual Ticket",
    description:
      "Ticket option for adults, children over 110cm, adventurers, seniors or guests with disabilities.",
    priceLabel: "Price to be confirmed",
  },
  {
    id: "under-92",
    name: "Children Under 92cms",
    description:
      "Children under 92cms are admitted free of charge and are measured with their shoes on.",
    priceLabel: "Free entry stated in FAQ",
  },
  {
    id: "seven-day",
    name: "7-Day Wristband",
    description:
      "7-Day wristbands can be prebooked online for use between select dates during the Main Season and Summer Holidays.",
    priceLabel: "Price to be confirmed",
  },
];

export const ticketingTodos = [
  "TODO: connect approved production authentication before real accounts are used.",
  "TODO: store customer accounts and baskets in the production database with privacy retention rules.",
  "TODO: verify live Digitickets pricing, availability and ticket categories before production.",
  "TODO: integrate an approved real payment gateway before taking payments.",
  "TODO: send email confirmations only through an approved transactional email service.",
  "TODO: add account verification, fraud controls, GDPR/privacy notices and retention rules.",
];
