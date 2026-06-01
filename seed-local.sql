-- Woodlands Cloudflare D1 seed data.

-- Production-safe seed contains public content only and no default passwords.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO roles (id, label) VALUES ('customer', 'Customer');
INSERT OR IGNORE INTO roles (id, label) VALUES ('admin', 'Admin');
INSERT OR IGNORE INTO roles (id, label) VALUES ('editor', 'Editor');
INSERT OR IGNORE INTO roles (id, label) VALUES ('staff', 'Staff');
INSERT OR IGNORE INTO roles (id, label) VALUES ('supervisor', 'Supervisor');
INSERT OR IGNORE INTO roles (id, label) VALUES ('manager', 'Manager');
INSERT OR IGNORE INTO roles (id, label) VALUES ('payroll_admin', 'Payroll Admin');
INSERT OR IGNORE INTO roles (id, label) VALUES ('super_admin', 'Super Admin');

INSERT OR IGNORE INTO departments (name, description) VALUES ('Rangers', 'Rides, attractions and guest safety');
INSERT OR IGNORE INTO departments (name, description) VALUES ('Zoo Farm', 'Animal care and visitor talks');
INSERT OR IGNORE INTO departments (name, description) VALUES ('Catering', 'Cafes, diners and food service');
INSERT OR IGNORE INTO departments (name, description) VALUES ('Admissions', 'Entrance kiosks and guest welcome');

INSERT OR IGNORE INTO ticket_types (slug, name, description, price_label, active, sort_order) VALUES ('family', 'Family Ticket', 'Ticket option for families visiting Woodlands. Live prices must be verified from the approved booking system before production.', 'Price to be confirmed', 1, 1);
INSERT OR IGNORE INTO ticket_types (slug, name, description, price_label, active, sort_order) VALUES ('individual', 'Individual Ticket', 'Ticket option for adults, children over 110cm, adventurers, seniors or guests with disabilities.', 'Price to be confirmed', 1, 2);
INSERT OR IGNORE INTO ticket_types (slug, name, description, price_label, active, sort_order) VALUES ('under-92', 'Children Under 92cms', 'Children under 92cms are admitted free of charge and are measured with their shoes on.', 'Free entry stated in FAQ', 1, 3);
INSERT OR IGNORE INTO ticket_types (slug, name, description, price_label, active, sort_order) VALUES ('seven-day', '7-Day Wristband', '7-Day wristbands can be prebooked online for use between select dates during the Main Season and Summer Holidays.', 'Price to be confirmed', 1, 4);

INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore', 'Explore', 'Explore the ride and attraction zones across Woodlands Family Theme Park.', 'action-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm', 'Zoo Farm', 'The 8-acre Zoo Farm includes animal activities, big farm animals, furry friends, reptiles, nocturnal animals and Zoo Farm rides.', 'zoo-farm.jpg', 'https://www.woodlandspark.com/devon-zoo/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting', 'Visiting', 'Plan tickets, accessibility, opening times, food, facilities, map, birthdays, camping, FAQs and contact details.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/groups', 'Groups', 'Group bookings, corporate days out and risk assessment information.', 'group-bookings.jpg', 'https://www.woodlandspark.com/general-groups/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/blog', 'News', 'Latest Woodlands news and blog content.', 'blog-spring.jpg', 'https://www.woodlandspark.com/blog/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events', 'Events', 'Events, special offers and character days for Woodlands visitors.', 'titan-event.jpg', 'https://www.woodlandspark.com/events/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/action-zone', 'Action Zone', 'Fast indoor fun for active adventurers, including Action Track One, Hero Ball Pool and the Triple Drop Slide.', 'action-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/action-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/arctic-zone', 'Arctic Zone', 'A cool outdoor adventure zone with water rides, karts and family challenges.', 'arctic-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/arctic-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/circus-drome-zone', 'Circus Drome Zone', 'A bright indoor play zone for slides, bouncing, soft play and shows.', 'circus-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/circus-drome-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/cyclone-canyon-zone', 'Cyclone Canyon Zone', 'A bigger-thrills zone with watercoasters, buggies, the toboggan run and Dino Trek.', 'cyclone-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/cyclone-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/falconry-centre', 'Falconry Centre', 'Daily falconry displays, aviary visits and group hawk talks in the park''s Falconry Centre.', 'falconry-centre.jpg', 'https://www.woodlandspark.com/rides-attractions/falconry-centre/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/farm-rides', 'Farm Rides', 'Family rides around the Zoo Farm, from tractors and pedal town to jumping and adventure golf.', 'farm-rides.jpg', 'https://www.woodlandspark.com/devon-zoo/rides/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/ninja-zone', 'Ninja Zone', 'Outdoor play, boats, towers and sand pit fun for energetic children.', 'ninja-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/ninja-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/sea-monster-zone', 'Sea Monster Zone', 'Sea-themed family rides and indoor discoveries, including Vertigo, Bumper Boats and the mirror maze.', 'sea-monster-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/sea-monster-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/explore/toddlers-village-zone', 'Toddlers Village Zone', 'A gentler play area for younger visitors, with the Toddler Village Play Area, paddling pool and Mermaid Ball Pool.', 'toddlers-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/toddlers-zone/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/animal-activities', 'Animal Activities', 'Hands-on activities listed on the existing site include chick petting, rabbit handling and meerkat feeding.', 'animal-activities.jpg', 'https://www.woodlandspark.com/devon-zoo/animal-activities/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/big-farm-animals', 'Big Farm Animals', 'Meet larger farm animals around the 8-acre Zoo Farm.', 'big-farm-animals.jpg', 'https://www.woodlandspark.com/devon-zoo/big-animal-barn/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/furry-friends', 'Furry Friends', 'A collection of smaller mammals and family favourites in the Zoo Farm.', 'furry-friends.jpg', 'https://www.woodlandspark.com/devon-zoo/furry-friends/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/falconry-centre', 'Falconry Centre', 'The Falconry Centre appears in both Explore and Zoo Farm navigation, with daily displays and group talks.', 'falconry-centre.jpg', 'https://www.woodlandspark.com/rides-attractions/falconry-centre/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/insects', 'Insects', 'Discover the bugs and insects featured around the Woodlands Zoo Farm.', 'insects.jpg', 'https://www.woodlandspark.com/devon-zoo/bugs-insects/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/new-babies', 'New Babies', 'Updates and new arrivals from Woodlands Zoo Farm.', 'new-babies.jpg', 'https://www.woodlandspark.com/devon-zoo/new-babies/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/nocturnal-house', 'Nocturnal House', 'A chance to see night-time creatures up close in a darker environment.', 'nocturnal-house.jpg', 'https://www.woodlandspark.com/devon-zoo/nocturnal-house/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/reptile-house', 'Reptile House', 'Reptiles and amphibians in the Woodlands Reptile House.', 'reptile-house.jpg', 'https://www.woodlandspark.com/devon-zoo/reptile-house/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/rabbit-guinea-pig-city', 'Rabbit & Guinea Pig City', 'A dedicated area for rabbits and guinea pigs, with multiple gallery images found in the sitemap.', 'rabbit-guinea-pig-city.jpg', 'https://www.woodlandspark.com/devon-zoo/rabbit-guinea-pig-city/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/zoo-farm/zoo-farm-rides', 'Zoo Farm Rides', 'Rides and active play around the Zoo Farm.', 'zoo-rides.jpg', 'https://www.woodlandspark.com/devon-zoo/rides/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/accessibility', 'Accessibility', 'Woodlands aims to provide a wheelchair and pushchair friendly environment, while noting that the natural valley location means gradients should be expected.', 'accessibility.jpg', 'https://www.woodlandspark.com/your-visit/accessibility/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/annual-pass', 'Annual Pass', 'A year of Woodlands access plus onsite discounts and selected camping benefits.', 'annual-pass.jpg', 'https://www.woodlandspark.com/your-visit/information/annual-pass/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/birthday-parties', 'Birthday Parties', 'Birthday parties include a day in the park, a themed party room, meals for children and a birthday child return ticket.', 'birthday.jpg', 'https://www.woodlandspark.com/woodlands-birthday-parties/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/charity-requests', 'Charity Requests', 'Woodlands is involved in community projects but cannot support every raffle prize request due to the number received.', 'zoo-farm.jpg', 'https://www.woodlandspark.com/your-visit/information/supporting-the-community/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/childminders-annual-pass', 'Childminder''s Annual Pass', 'A weekday annual pass option for registered childminders.', 'childminder-pass.jpg', 'https://www.woodlandspark.com/your-visit/information/childminders-annual-pass/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/dog-kennels', 'Dog Kennels', 'Dogs cannot enter the Theme Park except registered assistance dogs. A small number of kennels are available near the entrance.', 'dog-kennels.jpg', 'https://www.woodlandspark.com/dog-kennels/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/family-camping', 'Family Camping', 'Woodlands camping in Devon is promoted from only £38.50 per night, with theme park entry included for campers.', 'camping.jpg', 'https://www.woodlandspark.com/camping-in-devon/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/family-days-out-devon', 'Family Days Out in Devon', 'Woodlands is positioned as Devon''s largest family theme park, with indoor play, Zoo Farm, water rides, falconry and seasonal events.', 'home-hero.jpg', 'https://www.woodlandspark.com/family-days-out/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/food-drink', 'Food & Drink', 'Food locations extracted from the FAQs include Loves Grove Cafe, Courtyard Cafe, and Chicken & Pizza Parlour.', 'food-cafe.jpg', 'https://www.woodlandspark.com/your-visit/food-drink/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/gift-vouchers', 'Gift Vouchers', 'Gift voucher options include day entry, annual pass and camping vouchers.', 'gift-voucher.jpg', 'https://www.woodlandspark.com/your-visit/gift-vouchers/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/height-restrictions', 'Height Restrictions', 'Children under 17 years old must be supervised by an adult at all times.', 'cyclone-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/height-restrictions/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/information', 'Information', 'Helpful visitor information covering payments, dogs, policies, group discounts, first aid, lost property and ride closures.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/information/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/opening-times', 'Opening Times', 'The Opening Times page includes the 2026 calendar and detailed off-peak ride closure dates.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/information/opening-times/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/park-map', 'Park Map', 'Printable version of the Woodlands park map.', 'park-map.jpg', 'https://www.woodlandspark.com/your-visit/information/park-map/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/visitor-facilities', 'Visitor Facilities', 'Amenities, safety measures and helpful services for families visiting the park.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/visitor-facilities/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/tickets', 'Woodlands Park Tickets', 'Save up to 30% by booking online in advance. Choose your visit date, ticket quantities and review your reservation request.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/information/tickets/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/recruitment', 'Recruitment', 'Recruitment information and seasonal roles for Woodlands teams.', 'recruitment.jpg', 'https://www.woodlandspark.com/recruitment/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/contact-find-us', 'Contact & Find Us', 'Contact Woodlands for enquiries, feedback and visitor information.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/information/how-to-get-here/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/visiting/faqs', 'FAQs', 'Frequently asked ticket, voucher, food and admission questions.', 'home-hero.jpg', 'https://www.woodlandspark.com/your-visit/faqs/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/groups/corporate-days-out', 'Corporate Days Out', 'Company day out information highlights rides and discounts for groups up to 100 people.', 'corporate.jpg', 'https://www.woodlandspark.com/corporate-days-out/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/groups/group-bookings', 'Group Bookings', 'Group day out information for visits to Woodlands Family Theme Park.', 'group-bookings.jpg', 'https://www.woodlandspark.com/general-groups/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/groups/risk-assessments', 'Risk Assessments', 'Before using a ride or attraction, guests should read all height and safety instructions prior to use.', 'cyclone-zone.jpg', 'https://www.woodlandspark.com/groups/risk-assessments/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/terms-conditions', 'Terms & Conditions', 'Terms & Conditions covering legal notices, photography, logs, online tickets, emails, onsite information and social media competitions.', 'home-hero.jpg', 'https://www.woodlandspark.com/terms-conditions/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/privacy', 'Privacy', 'Privacy information covering cookies, mailing lists, customer records and email queries.', 'home-hero.jpg', 'https://www.woodlandspark.com/privacy/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/links', 'Links', 'Useful links include accommodation, sister parks and more to do in Devon.', 'camping.jpg', 'https://www.woodlandspark.com/links/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/icon-usage', 'Icon Usage', 'Icon usage credits icon authors from Flaticon.', 'logo-circle.jpg', 'https://www.woodlandspark.com/2545-2/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/titan-the-robot-4th-august', 'Titan The Robot! 4th August', 'Titan shows are included with standard admission tickets. Appearances will be at intervals throughout the day.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-4th-august/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/titan-the-robot-11th-august', 'Titan The Robot! 11th August', 'A futuristic interactive show with comedy, street theatre, music and special effects.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-11th-august/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/titan-the-robot-18th-august', 'Titan The Robot! 18th August', 'Catch Titan in action at intervals throughout the day with standard admission.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-18th-august/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/titan-the-robot-25th-august', 'Titan The Robot! 25th August', 'The final listed Titan Tuesday in August 2026.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-25th-august/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/egg-stravaganza-ticket-sale', 'Egg-Stravaganza Ticket Sale', 'A 2026 Easter ticket sale event for Woodlands visitors.', 'easter-sale.jpg', 'https://www.woodlandspark.com/events/egg-stravaganza-ticket-sale/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/easter-grotto-2026', 'Easter Grotto 2026', 'A seasonal Easter Grotto event for Woodlands visitors.', 'easter-grotto.jpg', 'https://www.woodlandspark.com/events/easter-grotto-2026/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/35-off-annual-pass-special-offer', '35% Off Annual Pass Special Offer', 'An annual pass special offer page found in the 2026 events sitemap.', 'annual-pass-offer.jpg', 'https://www.woodlandspark.com/events/35-off-annual-pass-special-offer/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/events/february-half-term-special-offer', 'February Half Term Special Offer', 'The extracted event content states: book ahead and enjoy £15 day tickets for everyone.', 'feb-offer.jpg', 'https://www.woodlandspark.com/events/february-half-term-special-offer/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/blog/springs-blessings-welcoming-new-arrivals', 'Spring''s Blessings: Welcoming New Arrivals to Woodlands Zoo Farm', 'Springtime at Woodlands Zoo Farm is a season of celebration and renewal, marked by newborn arrivals.', 'blog-spring.jpg', 'https://www.woodlandspark.com/springs-blessings-welcoming-new-arrivals-to-woodlands-zoo-farm/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/blog/celebrating-35-years-of-smiles', 'THROUGH THE YEARS: Celebrating 35 Years of Smiles and Adventures', 'A look back at Woodlands Family Theme Park''s 35th birthday in 2024.', 'blog-35.jpg', 'https://www.woodlandspark.com/celebrating-35-years-of-smiles/', 'published');
INSERT OR IGNORE INTO pages (path, title, summary, image, source_url, status) VALUES ('/blog/reader-star-awards-2019', 'Woodlands Family Theme Park Wins Big in the Primary Times Reader Star Awards 2019', 'Woodlands received seven Primary Times Reader Star Awards in 2019.', 'blog-awards.jpg', 'https://www.woodlandspark.com/woodlands-family-theme-park-wins-big-in-the-prestigious-primary-times-reader-star-awards-2019/', 'published');

INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Zone Information', 'Action Track One is listed as supervised with no minimum height.
A high-energy indoor zone for climbing, sliding and soft play.', 1 FROM pages WHERE path = '/explore/action-zone';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Accepted Evidence', 'DLA Letter
PIP Letter
Blue Badge
National Disabled ID Card
Nimbus Access Card', 1 FROM pages WHERE path = '/visiting/accessibility';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Benefits', 'Free entry to special guest events and character appearances
15% off Gift Shop purchases
10% off Catering
Birthday Party discounts
20% off touring pitch bookings during Woodlands Caravan & Camping Tariff A periods', 1 FROM pages WHERE path = '/visiting/annual-pass';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Camping Discount Dates', 'Tariff A dates listed for 2026: 27 March to 21 May, 1 June to 2 July, and 7 September to 1 November. The discount does not apply to glamping pod stays.', 2 FROM pages WHERE path = '/visiting/annual-pass';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Off-Peak & Winter Prices', 'Non-Annual Pass Holder - £21.95 per child
Annual Pass Holder - £15.50 per child
Children under 92cm - £9.95 per child', 1 FROM pages WHERE path = '/visiting/birthday-parties';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Main Season Prices', 'Non-Annual Pass Holder - £32.40 per child
Annual Pass Holder - £17.85 per child
Children under 92cm - £10.50 per child', 2 FROM pages WHERE path = '/visiting/birthday-parties';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Food Choices', 'Cheese & Tomato Pizza & Chips
Chicken Chunks & Chips
Pork Sausages & Chips
Fish Fingers & Chips
Beef Burger & Chips
Veggie Burger & Chips
Jacket Potato with Beans or Cheese', 3 FROM pages WHERE path = '/visiting/birthday-parties';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Camping Notes', 'The top navigation links to woodlandsgrove.co.uk. Woodlands camping content is included here and booking links go to the camping website.', 1 FROM pages WHERE path = '/visiting/family-camping';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Off-Peak Ride Closures', 'The rides not open during listed off-peak dates are Watercoasters, Toboggan Run, Pedal Boats, Arctic Gliders, Dune Buggies, Avalanche, Bumper Boats, Nutty''s Treehouse, Jumping Pillow and Safari Adventure Golf.', 1 FROM pages WHERE path = '/visiting/opening-times';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Not Open Dates From Current Page', '21, 22, 23, 28, 29 and 30 April; 8, 9, 10, 15, 16, 17, 22, 23, 24, 29 and 30 September; 1, 6, 7, 8, 13, 14, 15, 20, 21 and 22 October 2026.', 2 FROM pages WHERE path = '/visiting/opening-times';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, '7-Day Wristbands', 'Main Season and Summer Holiday tickets can be upgraded on the day to a 7-Day Wristband. Online ticket holders pay the difference between the online discounted price and the standard gate price.', 1 FROM pages WHERE path = '/tickets';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Guests With Disabilities', 'Woodlands offers a reduced rate for Guests with Disabilities. Documentary evidence is required at the admission kiosk.', 2 FROM pages WHERE path = '/tickets';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Driving Note', 'Southbound from the M5 at Exeter, follow the A38 Southbound towards Plymouth. Sat navs may route via the A380 to Torquay, which involves a ferry crossing.', 1 FROM pages WHERE path = '/visiting/contact-find-us';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'Titan shows are included with standard admission tickets. Appearances will be at intervals throughout the day.', 1 FROM pages WHERE path = '/events/titan-the-robot-4th-august';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'A futuristic interactive show with comedy, street theatre, music and special effects.', 1 FROM pages WHERE path = '/events/titan-the-robot-11th-august';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'Catch Titan in action at intervals throughout the day with standard admission.', 1 FROM pages WHERE path = '/events/titan-the-robot-18th-august';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'The final listed Titan Tuesday in August 2026.', 1 FROM pages WHERE path = '/events/titan-the-robot-25th-august';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'A 2026 Easter ticket sale event for Woodlands visitors.', 1 FROM pages WHERE path = '/events/egg-stravaganza-ticket-sale';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'A seasonal Easter Grotto event for Woodlands visitors.', 1 FROM pages WHERE path = '/events/easter-grotto-2026';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'An annual pass special offer page found in the 2026 events sitemap.', 1 FROM pages WHERE path = '/events/35-off-annual-pass-special-offer';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'Event Details', 'The extracted event content states: book ahead and enjoy £15 day tickets for everyone.', 1 FROM pages WHERE path = '/events/february-half-term-special-offer';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'News Summary', 'Springtime at Woodlands Zoo Farm is a season of celebration and renewal, marked by newborn arrivals.', 1 FROM pages WHERE path = '/blog/springs-blessings-welcoming-new-arrivals';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'News Summary', 'A look back at Woodlands Family Theme Park''s 35th birthday in 2024.', 1 FROM pages WHERE path = '/blog/celebrating-35-years-of-smiles';
INSERT OR IGNORE INTO page_sections (page_id, title, body, sort_order)
SELECT id, 'News Summary', 'Woodlands received seven Primary Times Reader Star Awards in 2019.', 1 FROM pages WHERE path = '/blog/reader-star-awards-2019';

INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/titan-the-robot-4th-august', 'Titan The Robot! 4th August', 'Tuesday 4 August 2026', 'Titan shows are included with standard admission tickets. Appearances will be at intervals throughout the day.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-4th-august/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/titan-the-robot-11th-august', 'Titan The Robot! 11th August', 'Tuesday 11 August 2026', 'A futuristic interactive show with comedy, street theatre, music and special effects.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-11th-august/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/titan-the-robot-18th-august', 'Titan The Robot! 18th August', 'Tuesday 18 August 2026', 'Catch Titan in action at intervals throughout the day with standard admission.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-18th-august/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/titan-the-robot-25th-august', 'Titan The Robot! 25th August', 'Tuesday 25 August 2026', 'The final listed Titan Tuesday in August 2026.', 'titan-august.jpg', 'https://www.woodlandspark.com/events/titan-the-robot-25th-august/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/egg-stravaganza-ticket-sale', 'Egg-Stravaganza Ticket Sale', '2026 event page found', 'A 2026 Easter ticket sale event for Woodlands visitors.', 'easter-sale.jpg', 'https://www.woodlandspark.com/events/egg-stravaganza-ticket-sale/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/easter-grotto-2026', 'Easter Grotto 2026', '2026 event page found', 'A seasonal Easter Grotto event for Woodlands visitors.', 'easter-grotto.jpg', 'https://www.woodlandspark.com/events/easter-grotto-2026/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/35-off-annual-pass-special-offer', '35% Off Annual Pass Special Offer', '2026 offer page found', 'An annual pass special offer page found in the 2026 events sitemap.', 'annual-pass-offer.jpg', 'https://www.woodlandspark.com/events/35-off-annual-pass-special-offer/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/events/february-half-term-special-offer', 'February Half Term Special Offer', '2026 offer page found', 'The extracted event content states: book ahead and enjoy £15 day tickets for everyone.', 'feb-offer.jpg', 'https://www.woodlandspark.com/events/february-half-term-special-offer/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/blog/springs-blessings-welcoming-new-arrivals', 'Spring''s Blessings: Welcoming New Arrivals to Woodlands Zoo Farm', '13 May 2024', 'Springtime at Woodlands Zoo Farm is a season of celebration and renewal, marked by newborn arrivals.', 'blog-spring.jpg', 'https://www.woodlandspark.com/springs-blessings-welcoming-new-arrivals-to-woodlands-zoo-farm/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/blog/celebrating-35-years-of-smiles', 'THROUGH THE YEARS: Celebrating 35 Years of Smiles and Adventures', '12 March 2024', 'A look back at Woodlands Family Theme Park''s 35th birthday in 2024.', 'blog-35.jpg', 'https://www.woodlandspark.com/celebrating-35-years-of-smiles/', 'published');
INSERT OR IGNORE INTO events (path, title, event_date, summary, image, source_url, status) VALUES ('/blog/reader-star-awards-2019', 'Woodlands Family Theme Park Wins Big in the Primary Times Reader Star Awards 2019', '19 November 2019', 'Woodlands received seven Primary Times Reader Star Awards in 2019.', 'blog-awards.jpg', 'https://www.woodlandspark.com/woodlands-family-theme-park-wins-big-in-the-prestigious-primary-times-reader-star-awards-2019/', 'published');

INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/action-zone', 'Action Zone', 'explore', 'Fast indoor fun for active adventurers, including Action Track One, Hero Ball Pool and the Triple Drop Slide.', 'action-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/action-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/arctic-zone', 'Arctic Zone', 'explore', 'A cool outdoor adventure zone with water rides, karts and family challenges.', 'arctic-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/arctic-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/circus-drome-zone', 'Circus Drome Zone', 'explore', 'A bright indoor play zone for slides, bouncing, soft play and shows.', 'circus-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/circus-drome-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/cyclone-canyon-zone', 'Cyclone Canyon Zone', 'explore', 'A bigger-thrills zone with watercoasters, buggies, the toboggan run and Dino Trek.', 'cyclone-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/cyclone-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/falconry-centre', 'Falconry Centre', 'explore', 'Daily falconry displays, aviary visits and group hawk talks in the park''s Falconry Centre.', 'falconry-centre.jpg', 'https://www.woodlandspark.com/rides-attractions/falconry-centre/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/farm-rides', 'Farm Rides', 'explore', 'Family rides around the Zoo Farm, from tractors and pedal town to jumping and adventure golf.', 'farm-rides.jpg', 'https://www.woodlandspark.com/devon-zoo/rides/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/ninja-zone', 'Ninja Zone', 'explore', 'Outdoor play, boats, towers and sand pit fun for energetic children.', 'ninja-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/ninja-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/sea-monster-zone', 'Sea Monster Zone', 'explore', 'Sea-themed family rides and indoor discoveries, including Vertigo, Bumper Boats and the mirror maze.', 'sea-monster-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/sea-monster-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/explore/toddlers-village-zone', 'Toddlers Village Zone', 'explore', 'A gentler play area for younger visitors, with the Toddler Village Play Area, paddling pool and Mermaid Ball Pool.', 'toddlers-zone.jpg', 'https://www.woodlandspark.com/rides-attractions/toddlers-zone/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/animal-activities', 'Animal Activities', 'zoo-farm', 'Hands-on activities listed on the existing site include chick petting, rabbit handling and meerkat feeding.', 'animal-activities.jpg', 'https://www.woodlandspark.com/devon-zoo/animal-activities/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/big-farm-animals', 'Big Farm Animals', 'zoo-farm', 'Meet larger farm animals around the 8-acre Zoo Farm.', 'big-farm-animals.jpg', 'https://www.woodlandspark.com/devon-zoo/big-animal-barn/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/furry-friends', 'Furry Friends', 'zoo-farm', 'A collection of smaller mammals and family favourites in the Zoo Farm.', 'furry-friends.jpg', 'https://www.woodlandspark.com/devon-zoo/furry-friends/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/falconry-centre', 'Falconry Centre', 'zoo-farm', 'The Falconry Centre appears in both Explore and Zoo Farm navigation, with daily displays and group talks.', 'falconry-centre.jpg', 'https://www.woodlandspark.com/rides-attractions/falconry-centre/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/insects', 'Insects', 'zoo-farm', 'Discover the bugs and insects featured around the Woodlands Zoo Farm.', 'insects.jpg', 'https://www.woodlandspark.com/devon-zoo/bugs-insects/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/new-babies', 'New Babies', 'zoo-farm', 'Updates and new arrivals from Woodlands Zoo Farm.', 'new-babies.jpg', 'https://www.woodlandspark.com/devon-zoo/new-babies/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/nocturnal-house', 'Nocturnal House', 'zoo-farm', 'A chance to see night-time creatures up close in a darker environment.', 'nocturnal-house.jpg', 'https://www.woodlandspark.com/devon-zoo/nocturnal-house/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/reptile-house', 'Reptile House', 'zoo-farm', 'Reptiles and amphibians in the Woodlands Reptile House.', 'reptile-house.jpg', 'https://www.woodlandspark.com/devon-zoo/reptile-house/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/rabbit-guinea-pig-city', 'Rabbit & Guinea Pig City', 'zoo-farm', 'A dedicated area for rabbits and guinea pigs, with multiple gallery images found in the sitemap.', 'rabbit-guinea-pig-city.jpg', 'https://www.woodlandspark.com/devon-zoo/rabbit-guinea-pig-city/', 'published');
INSERT OR IGNORE INTO attractions (path, title, zone_type, summary, image, source_url, status) VALUES ('/zoo-farm/zoo-farm-rides', 'Zoo Farm Rides', 'zoo-farm', 'Rides and active play around the Zoo Farm.', 'zoo-rides.jpg', 'https://www.woodlandspark.com/devon-zoo/rides/', 'published');

INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Before Booking Tickets', 'What do I need to do to visit?', '1) Check our opening times carefully.
2) View rides and attractions height restrictions list, this can be found here: Height Restrictions
3) Once you’re ready to book click the big TICKETS button and select the appropriate tickets for your visit. Tickets booked online before the day of entry are 30% off!', 1, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Before Booking Tickets', 'I have a complimentary ticket?', 'A complimentary ticket is a ticket that holds no monetary value. For example: a Woodlands ticket you have won in a raffle that admits one or two people.
Complimentary tickets can be redeemed at the entrance gate on the day of your visit. Complimentary tickets entitle the guest(s) to one visit only, unless otherwise stated.
This is not a Gift Voucher. Gift vouchers are used as a payment option similar to cash or card. This is also not an Annual Pass entry ticket.', 2, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Before Booking Tickets', 'I have a £3 off Voucher from your leaflet, can I use this?', 'These vouchers are only valid against tickets purchased at our entrance gate on arrival, during Park Fully Open & Summer Fun seasons. Please see terms and conditions printed on the voucher.', 3, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Before Booking Tickets', 'I have a Devon’s Top Attractions Entry Ticket, can i use this?', 'As a member of Devon’s Top Attractions you are able to use your complimentary tickets here.
Accepted tickets are Golden Tickets, Admits 2 and Family tickets. These are all valid during school holidays but not bank holidays. Please check the terms & conditions of your tickets carefully before visiting. Complimentary tickets can be redeemed at the entrance gate on the day of your visit.
Devon’s Top Attractions Staff Tickets are accepted at Woodlands however as per DATA rules these are not valid in school holidays.', 4, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Before Booking Tickets', 'I have a Twinlakes or Wheelgate Annual Pass, do I get a discount?', 'Twinlakes and Wheelgate Annual Pass Holders can receive 20% off Woodlands day entry tickets when purchasing them at the entrance kiosk.
Please bring proof of your Annual Pass (e.g. email receipt).', 5, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Opening Times and Prices', 'What does the entry price to Woodlands Park include?', 'The admission price includes entry to Woodlands Family Theme Park and the use of all the rides and attractions*
*With the exception of the Safari Adventure Golf, Teddy Mountain (Build your own teddy), coin operated and seasonal amusements. Height restrictions do apply on rides. A number of rides are closed during the Off Peak and winter season.
Please click here for our park and ride opening times', 6, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Opening Times and Prices', 'What times do the rides and attractions open and close?', 'This does vary dependant on the time of year.
During the main season and off-peak weekdays the park opens at 9:30am, the rides from 10am and closes at 5pm.
In the winter fun season the park is open from 10:30am to 4:30pm
We recommend checking the opening times page for the most up to date information.', 7, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Opening Times and Prices', 'Is the park open all year?', 'The opening times for the 2024 season have changed.
Please check the opening times page on our website for each seasons opening times
Woodlands park is open daily during the season from Easter – End of October half-term.
In the Winter Woodlands opens every weekend and Devon School Holidays.
The following rides are closed during the Off Peak Term Time & Winter Fun Seasons: Watercoasters, Toboggan Run, Pedal Boats, Arctic Gliders, Dune Buggies, Avalanche, Jumping Pillow, Safari Adventure Golf. There are additional charges for the Safari Adventure Golf and coin operated amusement machines.
During seasonal periods there may be themed grottos which require an additional charge for access.', 8, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Opening Times and Prices', 'Are there any admission concessions?', 'We offer concessions for the following:
Children under 92cms are admitted free of charge. Please Note: Children are measured with their shoes on.
Special concessions for children between 92cm – 110cm, Senior Citizens (60+) and Guests with Disabilities.
Carers Ticket
We do not offer free entry for carers instead we offer a high discounted price for the Guest with Disabilities.
Special concessions for groups of 10 or more paying guests.
Full details on Woodlands Family Theme Park Admissions Pricing can be found on our ticket prices page .', 9, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Opening Times and Prices', 'Do you accept Debit/Credit Card?', 'We accept debit and credit card on the entrance kiosk but are unable to take American Express.
Minimum transaction is £5', 10, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Online Ticket Help', 'What’s included in the ticket price?', 'The admission price includes entry to Woodlands Family Theme Park and the use of all the rides and attractions*
*With the exception of the Safari Adventure Golf, coin operated and seasonal amusements.
Height restrictions do apply on rides. A number of rides are closed during the winter and off peak term time seasons. Please check information on tickets page to see what’s open during your visit.', 11, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Online Ticket Help', 'When are tickets valid for?', 'Tickets to Woodlands Park are dated meaning they are only valid on the day you select when booking.
To change the date on your ticket: This needs to be done 24 hours before your visit and a £5 charge applies. You will need to call Woodlands Reception Team on 01803 712598 who will be able to change your ticket for a fee of £5 per booking number.
The 30% off discount is only available when you purchase your tickets online and at least 24 hours in advance. (During Fully Open & Summer Fun Seasons)
The 10% off discount is only available online and is available when you buy tickets on the day you wish to visit. (During Fully Open & Summer Fun Seasons)', 12, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Online Ticket Help', 'Can I get a refund if I can’t use my ticket?', 'Refunds are not available for any purchases.
To change the date on your ticket: This needs to be done 24 hours before your visit and a £5 charge applies. You will need to call Woodlands Reception Team on 01803 712598 who will be able to change your ticket for a fee of £5 per booking number.', 13, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Online Ticket Help', 'What is included in a family Ticket?', 'A family ticket includes any persons over 110cm in height, these can be adults, children or any combination of them. Children between 92cm – 110cm are classed as a adventurer and get a concession. Infants under 92cms are free of charge and do not require a ticket.', 14, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Online Ticket Help', 'How do I know if my children are eligible for free entry?', 'Only children under 92cms are admitted free of charge. Additional tickets will be available to purchase at admissions if required. Children’s height will be measured at Admissions – shoes must be worn. If you are unsure please do not purchase an online ticket as we are not able to refund tickets.', 15, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Online Ticket Help', 'Can I get a refund if one person doesn’t come?', 'Refunds are not available for any purchases made online.', 16, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Food, Drink and Shop', 'Which food outlets will be open?', 'Loves Grove Café, situated next to the Watercoasters.
Courtyard Café, situated at the Farm.
Chicken & Pizza Parlour, situated next to the Master Blaster.
Rays Diner, situated within the Empire of the Sea Dragon
Depending on seasonality and demand some cafés may be closed. Additional ice cream and drink kiosks will be open during appropriate weather.', 17, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Food, Drink and Shop', 'Can I bring a picnic?', 'Yes of course! You will be able to enjoy our lovely grounds and find the perfect spot for a picnic. There are various picnic benches and seating areas located around the park appropriate for having a picnic, especially on a sunny day!', 18, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Food, Drink and Shop', 'Can you cater for dietary requirements?', 'It’s important we know about your requirements before we prepare your food. Always make sure you tell our team about any dietary requirements before placing your order. We will be able to check which of our menu items meet your requirements.', 19, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Food, Drink and Shop', 'Is your gift shop open?', 'Yes – with cuddly toys, pocket money items, and souvenirs, our gift shop is a great place to finish your visit!
At Teddy Mountain, inside the gift shop, you can build and dress your very own teddy to take home!', 20, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Food, Drink and Shop', 'Can I pay by cash at your outlets?', 'Yes – cash or card can be used at most facilities in the park.
Please note: ice cream kiosks are cash only. Cashback is available at Reception.', 21, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Are there any age/height restrictions on the rides/attractions?', 'Yes, as with all other Theme Parks there are height and age restrictions on the majority of the rides for Health and Safety reasons. Details can be found on our rides pages. Details are also clearly stated on the information boards at the rides and printed in our park guide. For a full height restrictions list please click here .', 22, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Do any rides expose you to water?', 'Yes, the watercoasters and bumper boats are two areas where you are likely to get wet. We also have a small paddling pool which is open in the summer.', 23, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Do any attractions involve you being in confined space?', 'Some of the rides and attractions can be quite small in area and to some individuals these may feel confined.', 24, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Do any of the rides/attractions feature strobe lighting?', 'Yes strobe lighting is used within the Seascape Mirror Maze. Some areas do feature Ultra-Violet (UV) flashing lights.', 25, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Are the rides and attractions inspected on a daily basis?', 'All rides undergo a rigorous testing everyday by competent personnel in accordance with manufacturers guidance before the ride being opened to the public.', 26, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'If I am pregnant am I able to use the rides attractions?', 'We advise that you check the ride notices at each ride; however it is entirely at your own risk. In addition to the rides Woodlands has wonderful Woodlands walks, a fantastic collection of animals at Woodlands Zoo-Farm and Falconry Centre with displays that can be enjoyed.', 27, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Are any rides/attractions closed at certain times of the year?', 'In adverse weather conditions certain rides will not be run for safety reasons. The Toboggan Run and Jumping Pillow have to close when it is raining.
During the winter fun and offpeak term time seasons the following rides are closed: Watercoasters, Toboggan Run, Avalanche, Arctic Gliders, Dune Buggies, Pedal Boats, Farmyard Ride, Jumping Pillow and the Safari Adventure Golf.
During the winter not all attractions will have a Ride Operator.  If you would like to use a ride which is not closed for the winter please find a Ranger who will gladly open the ride for you.', 28, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('The Rides', 'Can I go on rides with a cast?', 'A guest with a limb in a plaster cast may be permitted to use a ride as long as they are able to adequately restrain themselves in a manner determined by the ride in question. The Ride Operator will be able to offer advice and their decisions on whether the guest is able to use the ride is final.', 29, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Other than the Rides and Attractions – what else does Woodlands have to offer?', 'Our Zoo-Farm is home to a wide range of animals, some you may recognise, others very exotic! Many of our zoo animals can be fed with feed available to buy on most days at the entrance kiosk.
In addition, guests can take a break from the rides by walking down into the valley and enjoying the beautiful natural scenery and ponds surrounding our pedal boats lake.', 30, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Can I holiday at Woodlands?', 'We have our own 5 star standard and AA 5 pennant campsite here at Woodlands. Even better when you stay at Woodlands Grove Caravan and Camping Park, Woodlands Family Theme Park is included in your stay.
Visit our campsite website here', 31, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Looking to holiday in the area? Our Self-Catering recommendations', 'Norton Park, Dartmouth tel: 01803 839500 (Chalets)
Hillfield Village, Hillfield, Dartmouth  01803 712322  (Cottages)
Or try the Dartmouth Tourist Information Centre on 01803 834224
You could also try www.southdevon.org.uk
We do hope you find somewhere to stay, the South Hams is such a beautiful area.
Perhaps you will be able to pay a day visit to Woodlands Leisure Park, open daily at 9.30am
see  www.woodlandspark.com for full info.', 32, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'What is the best way to get to Woodlands Park?', 'Details can be found on our Contact and Find us Page .', 33, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Is there a car parking charge?', 'All car parking is free. There is ample parking for our guests. When arriving at the park please follow the signs and our car parking staff instructions to ensure cars are parked both quickly and safely.', 34, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Is there electric vehicle charging?', 'Yes, EV chargers are located in the top day visitor’s car park. They are accessible via the Pod Point App.', 35, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Do you make charitable donations?', 'Details on our policy regarding our charitable donations can be found on our charity page.', 36, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Are there any traffic hazards on site?', 'We keep vehicle traffic to a minimum whilst the Park is open to the public. There is a designated area for coaches in the car park.', 37, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'What is shadow payments?', 'When paying for an order, your bank will send us an authorisation code to confirm there are funds in the account. Your bank will then proceed to ‘shadow’ the value of your order (this means they reserve the funds so that they cannot be spent elsewhere). The bank does this in anticipation of receiving a successful status against the transaction. When the bank is advised the transaction has been successful and that the funds are to be processed, this will ensure the funds are allocated correctly. However, if the transaction is not successfully completed (e.g. if the payment is declined or rejected) then the funds will go back into your account. Occasionally the ‘shadow’ may remain on your account for between 3-6 days depending on your bank.', 38, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Other FAQs', 'Summary', 'The quality and safety of all our rides and attractions are of the utmost importance. The staff at Woodlands Leisure Park are committed to ensuring that "our visitors are provided with a unique family experience that represents the best value for money day out in a safe and quality environment".
Policies are subject to change without notice. Violating Woodlands rules may lead to ejection and prosecution to the limits of the law.
We trust this information answers your queries and ensures you that the highest safety standards are employed here.
If you require any further information please contact us via email and a Woodlands Representative will contact you asap. Email fun@woodlandspark.com', 39, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Annual Passes', 'What do I get with an Annual Pass?', 'An Annual Pass to Woodlands includes unlimited visits to the park throughout the year. Benefit from access to our character days and special guest events, as well as discounted birthday parties!
Members not only get entry into Woodlands every open day for a year but they also get 10% off at our food outlets, 15% off gift shop purchases and 20% off caravan & camping stays.
For full info on our Annual Passes click the button below: On your first visit after buying an annual pass you will need to complete our annual pass form. We recommend printing off the form and completing it before your visit so we can get you set up and enjoying the park as quickly as possible.
If you do not have access to a printer, you can still complete this form at the entrance gate, however this will take a little longer.
If you can print the form, please download it from our Annual Pass page and don’t forget to bring it with you on your first visit.
Save time setting up your annual passes in person! Download and fill out your  2026 annual pass form here.', 40, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'What are the ticket options to gain entry to the park?', 'Tickets can either be purchased at the gate or via our online ticketing system.
Recommended:  Tickets purchased online before the day of entry are 30% off!
Tickets purchased online on the day of entry are 10% off.', 41, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'How do I purchase discounted tickets online?', 'To qualify for 30% off entry, tickets must be purchased in advance before the day you visit. Tickets will be automatically shown at the discounted price when purchasing in advance of your visit online.
Please note: up to 30% off discount tickets are only available during the Main Season & Summer Holiday seasons.
Tickets are dated tickets and are only valid on the date which is booked.
To change the date on your ticket: This needs to be done 24 hours before your visit and a £5 charge applies. You will need to call Woodlands Reception Team on 01803 712598 who will be able to change your ticket for a fee of £5 per booking number.
To buy your tickets please visit our online ticketing system.', 42, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'Do guests entering the park on a family ticket need to arrive at the same time?', 'Yes, this is the same for online tickets and tickets bought on the gate. All members of the family must enter the Park at the same time.', 43, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'Do you provide concessionary tickets for group bookings?', 'Group tickets are available for 10 paying guests or more. If you would like to book a group in please call our reception team on 01803 712598.', 44, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'How can I purchase an Annual Pass?', 'Annual Passes can be purchased online. To learn more visit our Annual Passes information page here
Alternatively…
Annual Passes can be purchased at the park either before entry or by upgrading your day tickets to an annual pass during your visit. Renewals can be done at the Entrance Gate. For more information please see our Annual Pass page', 45, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'Do you do Gift Vouchers?', 'Give a unique and fun gift! Purchase your gift vouchers online. For more information please see our Gift Vouchers page.
Alternatively, visit our reception during your visit to purchase a gift voucher.', 46, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Tickets and Season Passes', 'Do you offer Blue Light or NHS discount?', 'We do not offer NHS or Blue Light Discount at this time.
Discounted ticket rates are available for guests with disabilities and senior citizens (60+).', 47, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Buying Online', 'Do I need an email address?', 'Yes, a valid email address is required so we can send you your order confirmation.', 48, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Buying Online', 'Do I need a printer or smart phone?', 'Tickets purchased online have a barcode on them or a confirmation number which we need access to when you arrive at the park.  Please note if you just bring your confirmation number photo ID will be required.
Having your barcode ready at the entrance gate will help us get you into the park as quickly as possible.', 49, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Order Status', 'I have not received an order confirmation email?', 'Please call our reception team on 01803 712598 who can look into this for you.', 50, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Order Status', 'How do I check if my order has gone through?', 'If you experience an issue when purchasing your tickets i.e your internet connection drops or the payments page freezes. Please contact our reception team on 01803 712598 who will be able to tell you if the tickets have been purchased or if you need to rebook.', 51, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Order Status', 'I have purchased duplicate tickets what do I do?', 'Please call our reception team on 01803 712598 who can look into this for you.', 52, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Order Status', 'Do I need to bring my ticket order no or ID?', 'Yes please bring your ticket order number when you arrive on the entrance kiosk. If you can bring your order confirmation email with the scannable barcode this is preferred.', 53, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Can I use my Credit and/or Debit Card at the Park?', 'Yes we accept Debit and Credit Cards at our entrance kiosk, shops, Rays Diner, Chicken & Pizza Parlour and Loves Grove Cafe. A £5 minimum spend applies. Other catering outlets and ice cream kiosks are cash only.', 54, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Can I obtain cash at the park ?', 'Yes please come to the reception building behind the main entrance for cashback.', 55, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Does the park accept personal cheques?', 'In line with the majority of other businesses the park does not accept personal cheques. Cheques drawn against a business account or group can be accepted but only by prior arrangement.', 56, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Do you operate a fast track queuing system?', 'No, we operate a traditional queuing system. Please respect fellow Woodlands guests by waiting your turn. Cutting in, line jumping or disruptive conduct is not permitted and may lead to you being asked to leave the park.  If you feel that your child may not be able to queue due to special circumstances please speak to the ride operator who will be able to assist you. For further information please call our reception team on 01803 722598.', 57, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Is it easy to find our way around the Park?', 'Yes, to assist with this each group receives a Park Guide which includes a detailed map of the Park when they purchase their Admission Tickets. There are also numerous sign posts and maps around the park.
You can also scan our QR code on entry for a digital map.', 58, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Do you hire wheelchairs and children’s buggies?', 'I’m afraid we do not hire wheelchairs or children’s buggies. We do recommend bringing buggies for children as unfortunately we cannot alter the location, Woodlands Family Theme Park is situated in a valley with steep hills; this can be difficult for wheelchair users, they would need a strong pusher.
If you wish to hire any scooters or wheelchairs this can be done with the following companies:
Wheelchair Hire St Johns: 01803 835818 or 07815 852737
Red Cross (Totnes): 01803 863563
Scooter Hire: New Ability (Paignton): 01803 555961', 59, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Do you allow smoking in the park?', 'Our Park is a no smoking/vaping park. No smoking/vaping is allowed on any attraction, ride, gift shop and queue or inside any building. For cigarette ends please dispose of them in the receptacles provided. Please smoke/vape in the designated areas only, located at the Sea Monster Zone.', 60, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Does the park operate a dress code?', 'Yes, in line with our family image gentlemen are requested to wear a T-Shirt or similar at all times.', 61, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'What are the medical provisions on site?', 'The park has a First Aid Centre which is located on the patio opposite Reception, there is a bell to ring to call for a First Aider. Qualified First Aiders are also available in the Park to deal with minor injuries.', 62, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'What happens if I lose a child?', 'The park has a comprehensive and well proven lost child procedure of which all our staff are trained to follow. It is a good idea to make a pre-arranged meeting place.
In the event of a lost child please notify a staff member in the area the child went missing. You can also report lost children to Reception who will have contact with other members of staff around the park. Reception is the point of contact where lost children will stay. We advice that you set up a place in the park where a member of staff will be.', 63, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Are there any steep slopes on the site?', 'Woodlands is situated in a valley so many of the paths are on steep slopes. Wheelchair users will need a strong pusher and please note some electric wheelchairs cannot cope with the incline.', 64, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Baby changing facilities?', 'There are baby changing facilities in the park which are located on the Park Guide. A microwave is available for heating food in the Empire of the Sea Dragon on the café level.', 65, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Do you allow dogs or pets in the park?', 'Pets are not permitted in the theme park with the exception of Assistance dogs. Unsupervised, free kennels are available on a first come first served basis and are non-bookable.  Woodlands is not responsible for the feeding, watering, cleaning or welfare of your pet.  Please make sure the kennel is left clean and tidy. Just take £25 to the entrance kiosk on arrival as the deposit for the padlock; the £25 is refunded when the padlock is returned. You will need to bring your own water bowl and blanket/bed, there is a tap at the kennels to fill your bowl.', 66, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'What catering facilities are there at the park?', 'Please visit our Food and drink section to find out more.', 67, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Are we able to bring a picnic?', 'Guests are welcome to bring their own picnic and there are picnic areas around the park where these can be enjoyed.', 68, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Are there lockers within the park?', 'Lockers can be found in the Empire of the Sea Dragon, Circus Drome and upstairs in Lovesgrove café. These are fully secured with a key and are charged at 20p per use. No loose articles are permitted on the rides and slides.', 69, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Is there lots to do when it’s raining?', 'There is plenty to do when it is raining! We have the largest indoor play area in the South West with over 120,000sq ft of indoor play. In this one building there is 5 floors of indoor action with fairground style rides like Trauma Tower and The Submarine Ride, as well as a huge soft play area with a separate dedicated play area for little ones. We have the Circus Drome Play Zone, Falconry Centre and the majority of the buildings in the Zoo-Farm are all undercover. Both our Swing Ship and Vertigo outdoor rides can operate in most weather conditions and during the summer our water rides can remain open unless for extreme weather.', 70, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('On the Day', 'Can I exit the park to collect belongings from the car?', 'Absolutely, by obtaining a Hand Stamp at the Entrance Kiosks, it allows guests to exit the Park to collect and return belongings from and to their car whenever they wish.', 71, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'How many people do I need to qualify for group rates?', 'For Family Groups: 20 or more paying people. If you have less than 20 paying customers, the standard admission rates will apply.
For Organisational Groups: 10 or more paying people. If you have less than 10 paying customers the standard admission rates will apply. Please speak to our Reception team for more details on Organisation Groups.', 72, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Do groups members need to arrive together?', 'Yes the group must enter the park altogether.', 73, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Do I need to book?', 'Yes, please make sure group bookings are booked in at least 24 hours before your visit by calling 01803 712598.', 74, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Do you give Free concessions to group organisers?', 'We offer generous Free Leaders ratios, variable according to the age group of the children in the party, to ensure adequate supervision. The adults with children under the age of 17 are responsible for them at all times, so must be with the group throughout the visit.', 75, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'When do I pay?', 'Payment for groups must be made on arrival to the admission kiosks.
To qualify for the group rates prices, this must be pre-booked over the phone and to speed up entry please let us know the number of adults, children over 110cms, adventurers 92cms-110cms and infants under 92cm before you come.
For any other enquiries regarding paying for your group visit please call our reception team on 01803 712598.', 76, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Do I pay a deposit?', 'Group visits require a £75 non refundable deposit payment to secure.', 77, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'How do I pay?', 'Payment can be made by credit/debit card (not American Express) or by cash. Payment is required on the day of the visit. Please note we do not accept personal cheques. We do accept group company cheques but this must be arranged prior to the group arriving.', 78, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Do you have coach parking?', 'We do have free coach parking in the lower car park. Coach drivers are given free admission to the park.', 79, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Can I buy tickets before the day?', 'We are able to provide pre paid tickets as long as it is done at least two weeks in advance. Payment must be taken at the time of booking and tickets will be sent out to the group organiser to distribute. Pre paid tickets will be date specific and please note there are no refunds or date changes on pre-paid tickets.', 80, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Can we arrive in separate cars?', 'Yes we have plenty of free car parking. You will need to arrange to meet in the car park and go to the admission kiosks together and pay in one transaction.', 81, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Can we go back to the coach or cars?', 'Yes you just need to visit the admission kiosks on the way out and get your hand stamped.', 82, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'Are there any toilets in the car park?', 'Yes we have toilets in the lower car park.', 83, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'In the event that children misbehave – disciplinary action?', 'The Park has regulations displayed on boards around the Park. Staff are trained to enforce these regulations. Staff will instruct children/adults to behave where necessary, particularly if safety is compromised.', 84, 1);
INSERT OR IGNORE INTO faqs (group_title, question, answer, sort_order, active) VALUES ('Group Visits', 'What should I do if I lose a child?', 'The park has a comprehensive and well proven lost child procedure of which all our staff are trained to follow. It is a good idea to make a pre-arranged meeting place.
In the event of a lost child please notify a staff member in the area the child went missing. You can also report lost children to Reception who will have contact with other members of staff around the park. Reception is the point of contact where lost children will stay. We advice that you set up a place in the park where a member of staff will be.', 85, 1);

INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-01', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-02', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-05', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-06', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-07', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-08', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-09', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-10', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-11', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-12', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-13', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-14', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-15', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-16', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-17', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-18', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-19', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-20', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-21', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-22', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-23', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-24', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-25', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-27', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-28', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-29', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-04-30', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-01', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-02', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-05', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-06', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-07', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-08', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-09', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-10', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-11', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-12', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-13', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-14', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-15', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-16', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-17', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-18', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-19', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-20', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-21', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-22', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-23', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-24', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-25', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-27', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-28', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-29', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-30', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-05-31', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-01', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-02', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-05', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-06', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-07', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-08', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-09', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-10', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-11', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-12', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-13', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-14', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-15', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-16', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-17', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-18', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-19', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-20', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-21', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-22', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-23', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-24', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-25', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-27', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-28', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-29', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-06-30', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-01', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-02', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-05', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-06', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-07', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-08', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-09', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-10', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-11', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-12', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-13', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-14', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-15', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-16', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-17', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-18', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-19', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-20', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-21', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-22', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-23', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-24', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-25', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-27', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-28', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-29', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-30', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-07-31', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-01', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-02', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-05', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-06', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-07', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-08', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-09', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-10', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-11', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-12', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-13', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-14', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-15', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-16', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-17', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-18', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-19', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-20', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-21', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-22', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-23', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-24', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-25', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-27', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-28', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-29', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-30', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-08-31', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-01', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-02', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-05', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-06', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-07', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-08', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-09', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-10', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-11', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-12', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-13', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-14', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-15', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-16', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-17', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-18', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-19', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-20', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-21', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-22', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-23', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-24', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-25', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-27', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-28', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-29', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-09-30', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-01', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-02', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-03', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-04', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-05', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-06', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-07', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-08', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-09', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-10', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-11', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-12', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-13', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-14', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-15', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-16', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-17', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-18', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-19', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-20', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-21', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-22', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-23', 'off-peak', 'Off Peak Weekdays', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-24', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-25', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-26', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-27', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-28', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-29', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-30', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-10-31', 'main', 'Main Season', '09:30', '17:00', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-01', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-02', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-03', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-04', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-05', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-06', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-07', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-08', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-09', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-10', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-11', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-12', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-13', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-14', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-15', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-16', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-17', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-18', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-19', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-20', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-21', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-22', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-23', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-24', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-25', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-26', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-27', 'closed', 'Park Closed', NULL, NULL, NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-28', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-29', 'winter', 'Winter Fun', '10:30', '16:30', NULL);
INSERT OR IGNORE INTO opening_times (date, status, season_label, open_time, close_time, notes) VALUES ('2026-11-30', 'closed', 'Park Closed', NULL, NULL, NULL);

INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Woodlands Family Theme Park Access Statement 2024', 'Woodlands accessibility access statement PDF.', 'accessibility/woodlands-family-theme-park-access-statement-2024.pdf', 'https://www.woodlandspark.com/wp-content/uploads/2024/12/Woodlands-Family-Theme-Park-Access-Statement-2024.pdf', '["/visiting/accessibility","/visiting/height-restrictions"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Childminder Annual Membership Form 2026', 'Childminder annual pass application form PDF.', 'forms/childminder-annual-membership-form-2026.pdf', 'https://www.woodlandspark.com/wp-content/uploads/2026/01/Childminder-Annual-Membership-Form-2026.pdf', '["/visiting/childminders-annual-pass"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Annual Membership Form 2026', 'Annual membership application form PDF.', 'forms/annual-membership-form-2026.pdf', 'https://www.woodlandspark.com/wp-content/uploads/2026/01/Annual-Membership-Form-2026.pdf', '["/visiting/annual-pass","/visiting/faqs"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Animal Keeper Job Description', 'Recruitment job description DOCX.', 'recruitment/animal-keeper-job-description.docx', 'https://www.woodlandspark.com/wp-content/uploads/2026/02/Animal-Keeper-Job-Description.docx', '["/visiting/recruitment"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Birthday Party Invitations', 'Printable birthday party invitations PDF.', 'birthday/invite-2015-pdf.pdf', 'https://woodlandspark.com/wp-content/uploads/2015/02/Invite-2015-pdf.pdf', '["/visiting/birthday-parties"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Woodlands Safety Code', 'Safety code PDF linked from the risk assessment page.', 'safety/woodlands-safety-code-2016-updated-june-2016-1.pdf', 'http://woodlandspark.com/wp-content/uploads/2015/02/Woodlands-Safety-Code-2016-updated-June-2016-1.pdf', '["/groups/risk-assessments","/visiting/height-restrictions"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('Full 2026 Calendar', 'Full Woodlands 2026 opening calendar image.', 'opening-times/2026-calendar.jpg', 'https://www.woodlandspark.com/wp-content/uploads/2026/03/2026-Calendar-3.jpg', '["/visiting/opening-times"]');
INSERT OR IGNORE INTO documents (title, description, local_path, source_url, page_paths) VALUES ('2025 Woodlands Park Map', 'Printable Woodlands park map image.', 'park-map/2025-woodlands-park-map-v2-1.jpg', 'https://www.woodlandspark.com/wp-content/uploads/2025/02/2025-Woodlands-Park-Map-V2-1.jpg', '["/visiting/park-map"]');

INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Book Tickets', '/tickets', 1, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Birthday Parties', '/visiting/birthday-parties', 2, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Newsletter', '/newsletter', 3, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('FAQs', '/visiting/faqs', 4, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Family Days Out in Devon', '/visiting/family-days-out-devon', 5, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Park Map', '/visiting/park-map', 6, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Terms & Conditions', '/terms-conditions', 7, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Recruitment', '/visiting/recruitment', 8, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Privacy', '/privacy', 9, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Links', '/links', 10, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Icon Usage', '/icon-usage', 11, 0);
INSERT OR IGNORE INTO footer_links (label, path, sort_order, external) VALUES ('Blog', '/blog', 12, 0);

INSERT OR IGNORE INTO cafes (slug, label, description, active) VALUES ('raysdiner', 'Ray''s Diner', 'Woodlands cafe menu browsing', 1);
INSERT OR IGNORE INTO cafes (slug, label, description, active) VALUES ('lovesgrove', 'Loves Grove Cafe', 'Woodlands cafe menu browsing', 1);
INSERT OR IGNORE INTO cafes (slug, label, description, active) VALUES ('cosmiccafe', 'Cosmic Cafe', 'Woodlands cafe menu browsing', 1);

INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Burgers & Baps', 'Food', 'red', 10);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Chips', 'Food', 'amber', 20);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Jacket Potato', 'Food', 'orange', 30);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Pasties/Pie', 'Food', 'orange', 35);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Kids Meals', 'Food', 'teal', 40);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Pizza', 'Food', 'red', 45);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Grill & Hot Dogs', 'Food', 'amber', 47);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Snacks', 'Treats', 'pink', 50);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Drinks', 'Drinks', 'blue', 60);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Hot Drinks', 'Drinks', 'indigo', 70);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Gluten Free', 'Food', 'emerald', 75);
INSERT OR IGNORE INTO menu_categories (name, group_name, theme, display_order) VALUES ('Ice Cream', 'Treats', 'emerald', 80);

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cheese Burger', 'Classic beef patty with melted cheese.', 650, 'foodorder/cheeseburger.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cheese Burger', 'Classic beef patty with melted cheese.', 650, 'foodorder/cheeseburger.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Beef Burger', 'Juicy beef burger in a toasted bap.', 680, 'foodorder/beefburger.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Beef Burger', 'Juicy beef burger in a toasted bap.', 680, 'foodorder/beefburger.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Veggie Burger (Normal)', 'Plant-based burger with standard bun and crisp salad.', 620, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Veggie Burger (Normal)', 'Plant-based burger with standard bun and crisp salad.', 620, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Veggie Burger (Normal)', 'Plant-based burger with standard bun and crisp salad.', 620, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Egg Sausage Bap', 'Sausage and egg in a soft bap.', 550, 'foodorder/baconsausagebap.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bacon Sausage Bap', 'Bacon and sausage in a warm bap.', 580, 'foodorder/baconsausagebap.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bacon Egg Sausage Bap', 'Loaded bap with bacon, egg, and sausage.', 620, 'foodorder/baconeggsausagebap.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Hot Dog', 'Classic hot dog served in a soft roll.', 540, 'foodorder/hotdog.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chicken Burger', 'Crispy chicken burger in a toasted bun.', 660, 'foodorder/chicken-burger.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chicken Burger', 'Crispy chicken burger in a toasted bun.', 660, 'foodorder/chicken-burger.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Burgers & Baps';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips', 'Golden crispy chips.', 300, 'foodorder/chips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips', 'Golden crispy chips.', 300, 'foodorder/chips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips', 'Golden crispy chips.', 300, 'foodorder/chips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Veggie Burger (Gluten Free)', 'Plant-based burger on a gluten-free bun.', 640, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Gluten Free';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Veggie Burger (Gluten Free)', 'Plant-based burger on a gluten-free bun.', 640, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Gluten Free';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Veggie Burger (Gluten Free)', 'Plant-based burger on a gluten-free bun.', 640, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Gluten Free';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Gluten Free Chips', 'Crispy chips prepared as a gluten-free option.', 320, 'foodorder/chips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Gluten Free';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Gluten Free Chips', 'Crispy chips prepared as a gluten-free option.', 320, 'foodorder/chips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Gluten Free';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Gluten Free Chips', 'Crispy chips prepared as a gluten-free option.', 320, 'foodorder/chips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Gluten Free';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Cheese', 'Crispy chips topped with melted cheese.', 380, 'foodorder/chips-cheese.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Cheese', 'Crispy chips topped with melted cheese.', 380, 'foodorder/chips-cheese.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Cheese', 'Crispy chips topped with melted cheese.', 380, 'foodorder/chips-cheese.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Curry', 'Crispy chips with rich curry sauce.', 380, 'foodorder/chips-curry.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Curry', 'Crispy chips with rich curry sauce.', 380, 'foodorder/chips-curry.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Curry', 'Crispy chips with rich curry sauce.', 380, 'foodorder/chips-curry.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Chilli', 'Crispy chips with spicy chilli topping.', 400, 'foodorder/chips-chilly.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Chilli', 'Crispy chips with spicy chilli topping.', 400, 'foodorder/chips-chilly.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chips + Chilli', 'Crispy chips with spicy chilli topping.', 400, 'foodorder/chips-chilly.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Chips';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Cheese', 'Baked jacket potato with cheese filling.', 450, 'foodorder/jacket-cheese.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Cheese', 'Baked jacket potato with cheese filling.', 450, 'foodorder/jacket-cheese.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Cheese', 'Baked jacket potato with cheese filling.', 450, 'foodorder/jacket-cheese.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Chilli', 'Baked jacket potato with chilli topping.', 520, 'foodorder/jacket-chilly.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Chilli', 'Baked jacket potato with chilli topping.', 520, 'foodorder/jacket-chilly.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Chilli', 'Baked jacket potato with chilli topping.', 520, 'foodorder/jacket-chilly.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Curry', 'Baked jacket potato with curry sauce.', 500, 'foodorder/jacket-curry.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Curry', 'Baked jacket potato with curry sauce.', 500, 'foodorder/jacket-curry.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Jacket + Curry', 'Baked jacket potato with curry sauce.', 500, 'foodorder/jacket-curry.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Jacket Potato';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Sausage Roll', 'Flaky pastry sausage roll.', 280, 'foodorder/sausage-roll.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Sausage Roll', 'Flaky pastry sausage roll.', 280, 'foodorder/sausage-roll.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Sausage Roll', 'Flaky pastry sausage roll.', 280, 'foodorder/sausage-roll.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Pie', 'Freshly baked house pie.', 420, 'foodorder/pie.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Pie', 'Freshly baked house pie.', 420, 'foodorder/pie.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Pie', 'Freshly baked house pie.', 420, 'foodorder/pie.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Steak Pasty', 'Hearty steak-filled pasty.', 440, 'foodorder/steak-pasty.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Steak Pasty', 'Hearty steak-filled pasty.', 440, 'foodorder/steak-pasty.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Steak Pasty', 'Hearty steak-filled pasty.', 440, 'foodorder/steak-pasty.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cheese and Onion Pasty', 'Cheese and onion filling in flaky pastry.', 410, 'foodorder/cheese-and-onion-pasty.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cheese and Onion Pasty', 'Cheese and onion filling in flaky pastry.', 410, 'foodorder/cheese-and-onion-pasty.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cheese and Onion Pasty', 'Cheese and onion filling in flaky pastry.', 410, 'foodorder/cheese-and-onion-pasty.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pasties/Pie';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cheese Burger Meal', 'Kids meal with mini cheese burger.', 550, 'foodorder/kidscheeseburgermeal.avif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cheese Burger Meal', 'Kids meal with mini cheese burger.', 550, 'foodorder/kidscheeseburgermeal.avif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cheese Burger Meal', 'Kids meal with mini cheese burger.', 550, 'foodorder/kidscheeseburgermeal.avif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Chicken Chunk Meal', 'Kids meal with crispy chicken chunks.', 550, 'foodorder/kidschickenchunkmeal.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Chicken Chunk Meal', 'Kids meal with crispy chicken chunks.', 550, 'foodorder/kidschickenchunkmeal.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Chicken Chunk Meal', 'Kids meal with crispy chicken chunks.', 550, 'foodorder/kidschickenchunkmeal.jfif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Beef Burger Meal', 'Kids meal with beef burger.', 580, 'foodorder/kidsbeefburgermeal.avif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Beef Burger Meal', 'Kids meal with beef burger.', 580, 'foodorder/kidsbeefburgermeal.avif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Beef Burger Meal', 'Kids meal with beef burger.', 580, 'foodorder/kidsbeefburgermeal.avif', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Veggie Burger Meal', 'Kids meal with veggie burger.', 560, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Veggie Burger Meal', 'Kids meal with veggie burger.', 560, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Veggie Burger Meal', 'Kids meal with veggie burger.', 560, 'foodorder/vegie-burger.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cold Lunch Box Meal', 'Cold lunch box meal for kids.', 480, 'foodorder/kidscoldlunchboxmeal.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cold Lunch Box Meal', 'Cold lunch box meal for kids.', 480, 'foodorder/kidscoldlunchboxmeal.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cold Lunch Box Meal', 'Cold lunch box meal for kids.', 480, 'foodorder/kidscoldlunchboxmeal.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Hot Dog Meal', 'Kids hot dog meal with fries and drink.', 520, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Chicken Burger Meal', 'Kids chicken burger meal with fries and drink.', 560, 'foodorder/kidschickenburgermeal.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Cheese Pizza Meal', 'Kids pizza meal with cheese topping.', 600, 'foodorder/kids-cheese-pizza.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Kids Pork Pizza Meal', 'Kids pizza meal with pulled pork topping.', 620, 'foodorder/kids-chickenpizza.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Kids Meals';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, '12 Inch Four Cheese Pizza', 'Four-cheese blend on a 12-inch base.', 1190, 'foodorder/four-cheese-pizza.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pizza';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, '12 Inch Pulled Pork Pizza', '12-inch pizza loaded with pulled pork.', 1290, 'foodorder/pork-pizza.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pizza';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'BBQ Pizza', 'Smoky BBQ pizza with signature sauce.', 1150, 'foodorder/bbq-pizza.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pizza';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Vegan Pizza', 'Plant-based toppings on a crisp base.', 1120, 'foodorder/vegan-pizza.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Pizza';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chicken Strips', 'Crispy chicken strips with dip.', 650, 'foodorder/chicken-strips.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Grill & Hot Dogs';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Chicken Skewers', 'Seasoned grilled chicken skewers.', 670, 'foodorder/chicken-skewers.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Grill & Hot Dogs';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Family Box', 'Sharing box with mixed favourites.', 1490, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Grill & Hot Dogs';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Rollover', 'Rollover hot snack served warm.', 520, 'foodorder/rollover-hotdog.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Grill & Hot Dogs';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Crisps', 'Crispy grab-and-go snack pack.', 180, 'foodorder/crips.png', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Crisps', 'Crispy grab-and-go snack pack.', 180, 'foodorder/crips.png', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Crisps', 'Crispy grab-and-go snack pack.', 180, 'foodorder/crips.png', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Caramel Shortbread', 'Buttery shortbread with caramel layer.', 240, 'foodorder/caramelshortbread.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Caramel Shortbread', 'Buttery shortbread with caramel layer.', 240, 'foodorder/caramelshortbread.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Caramel Shortbread', 'Buttery shortbread with caramel layer.', 240, 'foodorder/caramelshortbread.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Brownie', 'Rich chocolate brownie slice.', 260, 'foodorder/brownie.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Brownie', 'Rich chocolate brownie slice.', 260, 'foodorder/brownie.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Brownie', 'Rich chocolate brownie slice.', 260, 'foodorder/brownie.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Rainbow Cupcake', 'Vanilla cupcake topped with rainbow icing.', 250, 'foodorder/Rainbowcupcake.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Rainbow Cupcake', 'Vanilla cupcake topped with rainbow icing.', 250, 'foodorder/Rainbowcupcake.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Rainbow Cupcake', 'Vanilla cupcake topped with rainbow icing.', 250, 'foodorder/Rainbowcupcake.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cookie Dough Brownie', 'Brownie layered with cookie dough.', 300, 'foodorder/cookiedoughbrownie.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cookie Dough Brownie', 'Brownie layered with cookie dough.', 300, 'foodorder/cookiedoughbrownie.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cookie Dough Brownie', 'Brownie layered with cookie dough.', 300, 'foodorder/cookiedoughbrownie.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Donut', 'Soft glazed donut.', 220, 'foodorder/donut.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Donut', 'Soft glazed donut.', 220, 'foodorder/donut.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Donut', 'Soft glazed donut.', 220, 'foodorder/donut.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Sweets / Chocolate', 'Assorted sweet and chocolate treats.', 200, 'foodorder/sweetschocolate.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Sweets / Chocolate', 'Assorted sweet and chocolate treats.', 200, 'foodorder/sweetschocolate.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Sweets / Chocolate', 'Assorted sweet and chocolate treats.', 200, 'foodorder/sweetschocolate.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Snacks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bottled Drink', 'Chilled bottled soft drink.', 220, 'foodorder/bottled-drink.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bottled Drink', 'Chilled bottled soft drink.', 220, 'foodorder/bottled-drink.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bottled Drink', 'Chilled bottled soft drink.', 220, 'foodorder/bottled-drink.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bottled Still Water', 'Still bottled water.', 150, 'foodorder/bottled-water.jpeg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bottled Still Water', 'Still bottled water.', 150, 'foodorder/bottled-water.jpeg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Bottled Still Water', 'Still bottled water.', 150, 'foodorder/bottled-water.jpeg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Shmoo Milkshake', 'Creamy milkshake with optional toppings.', 380, 'foodorder/shmoomilkshake.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Shmoo Milkshake', 'Creamy milkshake with optional toppings.', 380, 'foodorder/shmoomilkshake.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Shmoo Milkshake', 'Creamy milkshake with optional toppings.', 380, 'foodorder/shmoomilkshake.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Fruit Shoot', 'Fruit-flavoured kids drink bottle.', 190, 'foodorder/fruitshoot.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Fruit Shoot', 'Fruit-flavoured kids drink bottle.', 190, 'foodorder/fruitshoot.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Fruit Shoot', 'Fruit-flavoured kids drink bottle.', 190, 'foodorder/fruitshoot.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Flavoured Milk', 'Chilled flavoured milk bottle.', 210, 'foodorder/flavored-milk.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Flavoured Milk', 'Chilled flavoured milk bottle.', 210, 'foodorder/flavored-milk.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Flavoured Milk', 'Chilled flavoured milk bottle.', 210, 'foodorder/flavored-milk.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Slushy', 'Small size by default, upgrade to large.', 230, 'foodorder/slushy.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Slushy', 'Small size by default, upgrade to large.', 230, 'foodorder/slushy.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Slushy', 'Small size by default, upgrade to large.', 230, 'foodorder/slushy.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Fizzy Drink', 'Small size by default, upgrade to large.', 200, 'foodorder/fizzy-drink.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Fizzy Drink', 'Small size by default, upgrade to large.', 200, 'foodorder/fizzy-drink.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Fizzy Drink', 'Small size by default, upgrade to large.', 200, 'foodorder/fizzy-drink.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Tea', 'Freshly brewed tea.', 200, 'foodorder/tea.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Tea', 'Freshly brewed tea.', 200, 'foodorder/tea.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Tea', 'Freshly brewed tea.', 200, 'foodorder/tea.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Latte', 'Smooth espresso with steamed milk.', 300, 'foodorder/latte.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Latte', 'Smooth espresso with steamed milk.', 300, 'foodorder/latte.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Latte', 'Smooth espresso with steamed milk.', 300, 'foodorder/latte.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cappuccino', 'Foamy espresso classic.', 300, 'foodorder/cappuccino.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cappuccino', 'Foamy espresso classic.', 300, 'foodorder/cappuccino.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cappuccino', 'Foamy espresso classic.', 300, 'foodorder/cappuccino.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Black Coffee', 'Strong black coffee.', 260, 'foodorder/blackcoffe.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Black Coffee', 'Strong black coffee.', 260, 'foodorder/blackcoffe.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Black Coffee', 'Strong black coffee.', 260, 'foodorder/blackcoffe.jpg', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Flat White', 'Velvety espresso and milk.', 310, 'foodorder/flatwhite.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Flat White', 'Velvety espresso and milk.', 310, 'foodorder/flatwhite.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Flat White', 'Velvety espresso and milk.', 310, 'foodorder/flatwhite.webp', 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Hot Drinks';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Magnum', 'Kwality lollies classic Magnum.', 280, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Magnum', 'Kwality lollies classic Magnum.', 280, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Magnum', 'Kwality lollies classic Magnum.', 280, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cornetto', 'Kwality lollies Cornetto cone.', 240, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cornetto', 'Kwality lollies Cornetto cone.', 240, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cornetto', 'Kwality lollies Cornetto cone.', 240, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Mini Milk', 'Kwality lollies Mini Milk.', 160, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Mini Milk', 'Kwality lollies Mini Milk.', 160, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Mini Milk', 'Kwality lollies Mini Milk.', 160, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Calippo', 'Kwality lollies Calippo.', 200, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Calippo', 'Kwality lollies Calippo.', 200, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Calippo', 'Kwality lollies Calippo.', 200, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Feast', 'Kwality lollies Feast bar.', 230, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Feast', 'Kwality lollies Feast bar.', 230, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Feast', 'Kwality lollies Feast bar.', 230, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Haribo Push Up', 'Kwality lollies Haribo Push Up.', 220, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Haribo Push Up', 'Kwality lollies Haribo Push Up.', 220, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Haribo Push Up', 'Kwality lollies Haribo Push Up.', 220, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cornetto Go Sandwich', 'Kwality lollies Cornetto Go Sandwich.', 250, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cornetto Go Sandwich', 'Kwality lollies Cornetto Go Sandwich.', 250, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Cornetto Go Sandwich', 'Kwality lollies Cornetto Go Sandwich.', 250, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'cosmiccafe' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Yarde Farm Ice Cream - Single Scoop', 'Yarde Farm single scoop with optional flake.', 350, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Yarde Farm Ice Cream - Single Scoop', 'Yarde Farm single scoop with optional flake.', 350, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Yarde Farm Ice Cream - Double Scoop', 'Yarde Farm double scoop with optional flake.', 480, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'raysdiner' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO menu_items (cafe_id, category_id, name, description, price_pence, image, active)
SELECT cafes.id, menu_categories.id, 'Yarde Farm Ice Cream - Double Scoop', 'Yarde Farm double scoop with optional flake.', 480, NULL, 1
FROM cafes, menu_categories
WHERE cafes.slug = 'lovesgrove' AND menu_categories.name = 'Ice Cream';

INSERT OR IGNORE INTO allergens (name) VALUES ('Milk');
INSERT OR IGNORE INTO allergens (name) VALUES ('Egg');
INSERT OR IGNORE INTO allergens (name) VALUES ('Gluten');
INSERT OR IGNORE INTO allergens (name) VALUES ('Soya');
INSERT OR IGNORE INTO allergens (name) VALUES ('Nuts');
INSERT OR IGNORE INTO allergens (name) VALUES ('Sulphites');

-- Local example rows. Passwords are intentionally omitted; create users with the bootstrap script/API.

INSERT OR IGNORE INTO announcements (title, body, audience) VALUES ('Welcome to the Woodlands staff portal', 'Staff announcements appear here after authorised publishing.', 'all');

INSERT OR IGNORE INTO staff_documents (title, description, document_type, role_visibility, is_sensitive) VALUES ('Staff Handbook', 'Secure staff document access area.', 'document', 'staff', 0);
INSERT OR IGNORE INTO staff_documents (title, description, document_type, role_visibility, is_sensitive) VALUES ('Payslip Access', 'Payslip records require secure payroll integration before use.', 'payslip', 'payroll_admin', 1);
