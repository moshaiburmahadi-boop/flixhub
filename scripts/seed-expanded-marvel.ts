import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

const app = initializeApp({
  projectId: config.projectId,
  appId: config.appId,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
});

const db = getFirestore(app, config.firestoreDatabaseId);

interface MovieItem {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  personalRating: number;
  imdbRating: number;
  duration: string;
  contentType: 'movie' | 'series';
  episodeName?: string;
  episodeInfo?: string;
  releaseYear: number;
  category: string;
  subCategory?: string;
  description: string;
  personalReview: string;
  watchUrl: string;
  featured?: boolean;
  dateWatched?: string;
  createdAt: string;
  updatedAt: string;
}

const MARVEL_CATEGORY = {
  id: 'cat_marvel_mcu',
  name: 'Marvel',
  subCategories: [
    'Spider-Man',
    'Venom',
    'Iron Man',
    'Avengers',
    'Multiverse',
    'Guardians',
    'Disney+ Series',
    'Phase 1-3',
    'Latest Phase 4 & 5',
  ],
  createdAt: new Date().toISOString(),
};

const EXPANDED_MOVIES: MovieItem[] = [
  // --- IRON MAN TRILOGY ---
  {
    id: 'mcu_iron_man_2',
    title: 'Iron Man 2',
    posterUrl: 'https://image.tmdb.org/t/p/w780/6WBeq4ubGxUiqVh9zcr2slPfrvt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7vMq9kUb5HKILQQ9vYoeCEfm7nT.jpg',
    personalRating: 8.8,
    imdbRating: 6.9,
    duration: '2h 04m',
    contentType: 'movie',
    releaseYear: 2010,
    category: 'Marvel',
    subCategory: 'Iron Man',
    description: 'With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man with ties to his father\'s legacy, Ivan Vanko.',
    personalReview: 'Introduced Scarlett Johansson as Black Widow with that iconic hallway takedown! War Machine teaming up with Tony in the Japanese gardens was awesome.',
    watchUrl: 'https://www.disneyplus.com/movies/iron-man-2/1g4336B1516e',
    featured: false,
    dateWatched: '2023-11-10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 58).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_iron_man_3',
    title: 'Iron Man 3',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/a0xZ8ukRzFqZtJtS5jK0tMvJpP2.jpg',
    personalRating: 9.0,
    imdbRating: 7.1,
    duration: '2h 10m',
    contentType: 'movie',
    releaseYear: 2013,
    category: 'Marvel',
    subCategory: 'Iron Man',
    description: 'When Tony Stark\'s world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution, proving he is a hero even without the suit.',
    personalReview: 'Shane Black\'s detective flair and Tony\'s PTSD journey give this film heart. The "House Party Protocol" finale with dozens of automated suits is pure spectacle.',
    watchUrl: 'https://www.disneyplus.com/movies/iron-man-3/3k4336B1516e',
    featured: false,
    dateWatched: '2023-11-20',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 56).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- VENOM UNIVERSE ---
  {
    id: 'marvel_venom_1',
    title: 'Venom',
    posterUrl: 'https://image.tmdb.org/t/p/w780/2uNW4WbgBXL2544aKDoOtRdh04V.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/VuukZL9m1V178b9GduaIR7S2jg.jpg',
    personalRating: 8.9,
    imdbRating: 6.7,
    duration: '1h 52m',
    contentType: 'movie',
    releaseYear: 2018,
    category: 'Marvel',
    subCategory: 'Venom',
    description: 'Investigative journalist Eddie Brock gains superpowers after being bound to an alien symbiote named Venom whose species plans to invade Earth.',
    personalReview: 'Tom Hardy\'s chaotic chemistry with Venom inside his head is so much fun. "We are Venom" became an instant classic catchphrase.',
    watchUrl: 'https://www.netflix.com/title/80240819',
    featured: false,
    dateWatched: '2024-01-15',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'marvel_venom_2_carnage',
    title: 'Venom: Let There Be Carnage',
    posterUrl: 'https://image.tmdb.org/t/p/w780/rjkmN1dniUHVYAtwuV3Tji7Fs79.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/vIgyYkXkg6NC29vt5J0ebmO2Psu.jpg',
    personalRating: 8.7,
    imdbRating: 6.0,
    duration: '1h 37m',
    contentType: 'movie',
    releaseYear: 2021,
    category: 'Marvel',
    subCategory: 'Venom',
    description: 'Eddie Brock attempts to reignite his career by interviewing serial killer Cletus Kasady, who becomes the host of the violent symbiote Carnage and escapes prison.',
    personalReview: 'Woody Harrelson as Carnage is wild and menacing. Fast paced, brutal symbiote fights, and that huge Spider-Man post-credits tease.',
    watchUrl: 'https://www.netflix.com/title/81442110',
    featured: false,
    dateWatched: '2024-02-05',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'marvel_venom_3_last_dance',
    title: 'Venom: The Last Dance',
    posterUrl: 'https://image.tmdb.org/t/p/w780/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWMEAZYF.jpg',
    personalRating: 9.1,
    imdbRating: 6.2,
    duration: '1h 50m',
    contentType: 'movie',
    releaseYear: 2024,
    category: 'Marvel',
    subCategory: 'Venom',
    description: 'Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie\'s final dance.',
    personalReview: 'The emotional farewell to Tom Hardy\'s Venom trilogy. Introducing Knull and the Xenophages, with a touching ending that honors Eddie and Venom\'s bond.',
    watchUrl: 'https://www.sonypictures.com/movies/venomthelastdance',
    featured: true,
    dateWatched: '2024-10-25',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- SPIDER-MAN FRANCHISE ---
  {
    id: 'mcu_spiderman_homecoming',
    title: 'Spider-Man: Homecoming',
    posterUrl: 'https://image.tmdb.org/t/p/w780/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tcheoA2nPATCm2vvXw2IjVQoaEF.jpg',
    personalRating: 9.3,
    imdbRating: 7.4,
    duration: '2h 13m',
    contentType: 'movie',
    releaseYear: 2017,
    category: 'Marvel',
    subCategory: 'Spider-Man',
    description: 'Peter Parker balances his life as an ordinary high school student in Queens with his superhero alter-ego Spider-Man, and finds himself on the trail of a new menace prowling the skies of New York City: the Vulture.',
    personalReview: 'John Hughes vibes meet Marvel superheroics. Michael Keaton\'s car talk with Peter Parker before the homecoming dance is genuinely suspenseful.',
    watchUrl: 'https://www.netflix.com/title/80166369',
    featured: false,
    dateWatched: '2024-01-12',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 38).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_spiderman_far_from_home',
    title: 'Spider-Man: Far From Home',
    posterUrl: 'https://image.tmdb.org/t/p/w780/4q2hz2m8hubgvij98EzI0ZW8G8S.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/5myQbDzw3l8K9yofUXRJ4UTVgam.jpg',
    personalRating: 9.2,
    imdbRating: 7.4,
    duration: '2h 09m',
    contentType: 'movie',
    releaseYear: 2019,
    category: 'Marvel',
    subCategory: 'Spider-Man',
    description: 'Following the events of Avengers: Endgame, Peter Parker goes on a school trip to Europe. His plans to leave heroics behind for a few weeks are quickly scrapped when Nick Fury recruits him to fight the Elementals alongside Mysterio.',
    personalReview: 'Jake Gyllenhaal as Mysterio with the mind-bending illusion sequence in Berlin was straight out of the comic book pages. Sets up the crazy cliffhanger for No Way Home.',
    watchUrl: 'https://www.netflix.com/title/81055822',
    featured: false,
    dateWatched: '2024-02-18',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 36).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'marvel_spider_verse_1',
    title: 'Spider-Man: Into the Spider-Verse',
    posterUrl: 'https://image.tmdb.org/t/p/w780/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7d6wo0jw5L425Y7GkF3l0qZ3vI9.jpg',
    personalRating: 10,
    imdbRating: 8.4,
    duration: '1h 57m',
    contentType: 'movie',
    releaseYear: 2018,
    category: 'Marvel',
    subCategory: 'Spider-Man',
    description: 'Teen Miles Morales becomes the new Spider-Man, while joining five other alternate spider-heroes across the multiverse to stop Kingpin\'s multidimensional collider from wiping out reality.',
    personalReview: 'The "What\'s Up Danger" leap of faith is one of the most breathtaking scenes ever put on screen. Revolutionary comic book animation that changed the medium forever. Masterpiece.',
    watchUrl: 'https://www.netflix.com/title/81002747',
    featured: true,
    dateWatched: '2024-03-10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 34).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'marvel_spider_verse_2',
    title: 'Spider-Man: Across the Spider-Verse',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    personalRating: 9.9,
    imdbRating: 8.6,
    duration: '2h 20m',
    contentType: 'movie',
    releaseYear: 2023,
    category: 'Marvel',
    subCategory: 'Spider-Man',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a catastrophic threat, Miles finds himself pitted against Miguel O\'Hara.',
    personalReview: 'Visual perfection. Six distinct art styles seamlessly woven together, an incredible emotional core between Miles and his parents, and Daniel Pemberton\'s roaring soundtrack.',
    watchUrl: 'https://www.netflix.com/title/81442112',
    featured: true,
    dateWatched: '2024-04-05',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- LATEST & ICONIC MCU TITLES ---
  {
    id: 'mcu_gotg_vol_3',
    title: 'Guardians of the Galaxy Vol. 3',
    posterUrl: 'https://image.tmdb.org/t/p/w780/r2J02Z2OpNTctetGCSpkmM7TwZt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg',
    personalRating: 9.7,
    imdbRating: 7.9,
    duration: '2h 30m',
    contentType: 'movie',
    releaseYear: 2023,
    category: 'Marvel',
    subCategory: 'Guardians',
    description: 'Still reeling from the loss of Gamora, Peter Quill must rally his team to defend the universe and protect Rocket Raccoon from the High Evolutionary, a mission that could lead to the end of the Guardians as we know them.',
    personalReview: 'Rocket\'s backstory will bring tears to anyone\'s eyes. The single-take hallway fight set to "No Sleep till Brooklyn" is James Gunn at his cinematic peak. The best Phase 5 film.',
    watchUrl: 'https://www.disneyplus.com/movies/guardians-of-the-galaxy-vol-3/5p4336B1516e',
    featured: true,
    dateWatched: '2024-05-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_doctor_strange_multiverse',
    title: 'Doctor Strange in the Multiverse of Madness',
    posterUrl: 'https://image.tmdb.org/t/p/w780/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg',
    personalRating: 9.0,
    imdbRating: 6.9,
    duration: '2h 06m',
    contentType: 'movie',
    releaseYear: 2022,
    category: 'Marvel',
    subCategory: 'Multiverse',
    description: 'Doctor Strange teams up with a mysterious teenage girl from his dreams who can travel across multiverses, to battle multiple threats, including other-universe versions of himself and the Scarlet Witch.',
    personalReview: 'Sam Raimi brings full horror energy to Marvel! The Illuminati slaughter, the musical notes duel, and zombie Strange flying with souls of the damned are unforgettable.',
    watchUrl: 'https://www.disneyplus.com/movies/doctor-strange-in-the-multiverse-of-madness/2n4336B1516e',
    featured: false,
    dateWatched: '2024-01-28',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 26).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_shang_chi',
    title: 'Shang-Chi and the Legend of the Ten Rings',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1BIoJGKbXjdFDAvFarT3OAnOG5v.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/cinER0j21q7iFw3G7uW0Y6R5x1.jpg',
    personalRating: 9.2,
    imdbRating: 7.4,
    duration: '2h 12m',
    contentType: 'movie',
    releaseYear: 2021,
    category: 'Marvel',
    subCategory: 'Latest Phase 4 & 5',
    description: 'Shang-Chi, the master of weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization by his immortal father, Wenwu.',
    personalReview: 'Tony Leung as Wenwu brings Shakespearean depth to the villain role. The San Francisco bus fight and Macau scaffolding sequence have the best martial arts choreography in the MCU.',
    watchUrl: 'https://www.disneyplus.com/movies/shang-chi-and-the-legend-of-the-ten-rings/3j4336B1516e',
    featured: false,
    dateWatched: '2024-02-22',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_avengers_age_of_ultron',
    title: 'Avengers: Age of Ultron',
    posterUrl: 'https://image.tmdb.org/t/p/w780/4ssDuvEDkS9NvmR15ezIKxysM7S.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/8n5v93pS6k0G7vX6a6X8i9q0a1.jpg',
    personalRating: 8.9,
    imdbRating: 7.3,
    duration: '2h 21m',
    contentType: 'movie',
    releaseYear: 2015,
    category: 'Marvel',
    subCategory: 'Avengers',
    description: 'When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it\'s up to Earth\'s mightiest heroes to stop the villainous Ultron from enacting his terrible plan.',
    personalReview: 'Hulkbuster vs Hulk in South Africa is legendary. Introduced Wanda Maximoff, Vision, and laid all the groundwork for Civil War and Infinity War.',
    watchUrl: 'https://www.disneyplus.com/movies/avengers-age-of-ultron/7k4336B1516e',
    featured: false,
    dateWatched: '2023-12-18',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_captain_america_first_avenger',
    title: 'Captain America: The First Avenger',
    posterUrl: 'https://image.tmdb.org/t/p/w780/vSNxAJTlD0r02V9sPYpOjqD2w2Z.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/yFU2ipqnKxD89RBfvqcjhPQUeuq.jpg',
    personalRating: 8.9,
    imdbRating: 6.9,
    duration: '2h 04m',
    contentType: 'movie',
    releaseYear: 2011,
    category: 'Marvel',
    subCategory: 'Phase 1-3',
    description: 'Steve Rogers, a rejected military soldier, transforms into Captain America after taking a dose of a \'Super-Soldier serum\'. But being Captain America comes at a price as he attempts to take down a war monger and a terrorist organization.',
    personalReview: 'Chris Evans establishes Steve Rogers\' pure heart: "I can do this all day." Hugo Weaving as Red Skull and the poignant 1940s ending make this timeless.',
    watchUrl: 'https://www.disneyplus.com/movies/captain-america-the-first-avenger/4m4336B1516e',
    featured: false,
    dateWatched: '2023-11-28',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 54).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_wakanda_forever',
    title: 'Black Panther: Wakanda Forever',
    posterUrl: 'https://image.tmdb.org/t/p/w780/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xDMIl84Qo5Tsu62c9DGWhmPI672.jpg',
    personalRating: 9.1,
    imdbRating: 6.7,
    duration: '2h 41m',
    contentType: 'movie',
    releaseYear: 2022,
    category: 'Marvel',
    subCategory: 'Latest Phase 4 & 5',
    description: 'The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T\'Challa. A powerful new threat from the underwater nation of Talokan, led by Namor, surfaces.',
    personalReview: 'A deeply emotional tribute to Chadwick Boseman. Angela Bassett delivers an Oscar-nominated performance as Queen Ramonda, and Tenoch Huerta\'s Namor is captivating.',
    watchUrl: 'https://www.disneyplus.com/movies/black-panther-wakanda-forever/4j4336B1516e',
    featured: false,
    dateWatched: '2024-03-12',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedExpanded() {
  console.log('Updating Marvel Category subCategories...');
  await setDoc(doc(db, 'categories', MARVEL_CATEGORY.id), MARVEL_CATEGORY, { merge: true });

  console.log(`Adding ${EXPANDED_MOVIES.length} more Marvel, Spider-Man & Venom titles...`);
  for (const movie of EXPANDED_MOVIES) {
    await setDoc(doc(db, 'movies', movie.id), movie, { merge: true });
    console.log(`Added: ${movie.title} (${movie.releaseYear})`);
  }
  console.log('All additional Marvel & Venom movies seeded successfully!');
  process.exit(0);
}

seedExpanded().catch((err) => {
  console.error('Error seeding expanded:', err);
  process.exit(1);
});
