import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
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
  subCategories: ['Avengers', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4 & 5', 'Disney+ Series', 'Multiverse'],
  createdAt: new Date().toISOString(),
};

const MCU_MOVIES: MovieItem[] = [
  {
    id: 'mcu_avengers_endgame',
    title: 'Avengers: Endgame',
    posterUrl: 'https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    personalRating: 10,
    imdbRating: 8.4,
    duration: '3h 01m',
    contentType: 'movie',
    releaseYear: 2019,
    category: 'Marvel',
    subCategory: 'Avengers',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    personalReview: 'The pinnacle culmination of 22 films across the Infinity Saga. The portals sequence, Cap lifting Mjolnir, and Tony Stark\'s sacrifice define legendary cinema history. A true 10/10 masterpiece.',
    watchUrl: 'https://www.disneyplus.com/movies/marvel-studios-avengers-endgame/aRbTmORNmZaO',
    featured: true,
    dateWatched: '2024-05-12',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_avengers_infinity_war',
    title: 'Avengers: Infinity War',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/lmZFxVIz3Su7YnGIOFWAn9umsqQ.jpg',
    personalRating: 9.8,
    imdbRating: 8.4,
    duration: '2h 29m',
    contentType: 'movie',
    releaseYear: 2018,
    category: 'Marvel',
    subCategory: 'Avengers',
    description: 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.',
    personalReview: 'Pacing is relentless from the very opening scene on the Asgardian ship to the legendary Battle of Wakanda and the devastating Snap. Thanos is one of cinema\'s greatest antagonists.',
    watchUrl: 'https://www.disneyplus.com/movies/marvel-studios-avengers-infinity-war/1guAYbtflPfS',
    featured: true,
    dateWatched: '2024-04-10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_deadpool_wolverine',
    title: 'Deadpool & Wolverine',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/yDHYTjA3R0jFYba16jBB12M8GPs.jpg',
    personalRating: 9.3,
    imdbRating: 7.7,
    duration: '2h 08m',
    contentType: 'movie',
    releaseYear: 2024,
    category: 'Marvel',
    subCategory: 'Multiverse',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    personalReview: 'Electrifying team-up between Ryan Reynolds and Hugh Jackman. Full of bloody action, nostalgic cameos, and fourth-wall breaking hilarity that revitalized Phase 5.',
    watchUrl: 'https://www.disneyplus.com/movies/deadpool-wolverine/6k4336B1516e',
    featured: true,
    dateWatched: '2024-08-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_spiderman_no_way_home',
    title: 'Spider-Man: No Way Home',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg',
    personalRating: 9.6,
    imdbRating: 8.2,
    duration: '2h 28m',
    contentType: 'movie',
    releaseYear: 2021,
    category: 'Marvel',
    subCategory: 'Multiverse',
    description: 'Peter Parker\'s secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man, but a dangerous spell shatters the multiverse.',
    personalReview: 'The emotional high point of modern superhero cinema. Seeing Tom Holland, Tobey Maguire, and Andrew Garfield uniting across dimensions was pure magic.',
    watchUrl: 'https://www.netflix.com/title/81442111',
    featured: true,
    dateWatched: '2024-03-18',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_iron_man',
    title: 'Iron Man',
    posterUrl: 'https://image.tmdb.org/t/p/w780/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/cyecB7godJ6kNHGON0DGuhVJBMv.jpg',
    personalRating: 9.4,
    imdbRating: 7.9,
    duration: '2h 06m',
    contentType: 'movie',
    releaseYear: 2008,
    category: 'Marvel',
    subCategory: 'Phase 1',
    description: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil and takes up the mantle of Iron Man.',
    personalReview: 'The film that launched an entire cinematic empire. Robert Downey Jr. was born to play Tony Stark. Fresh, charismatic, and grounded.',
    watchUrl: 'https://www.disneyplus.com/movies/iron-man/544336B1516e',
    featured: false,
    dateWatched: '2023-11-04',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_the_avengers',
    title: 'The Avengers',
    posterUrl: 'https://image.tmdb.org/t/p/w780/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg',
    personalRating: 9.2,
    imdbRating: 8.0,
    duration: '2h 23m',
    contentType: 'movie',
    releaseYear: 2012,
    category: 'Marvel',
    subCategory: 'Phase 1',
    description: 'When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster.',
    personalReview: 'The first crossover event that proved shared cinematic universes could work. The circular 360-degree hero shot in New York remains immortal.',
    watchUrl: 'https://www.disneyplus.com/movies/the-avengers/2h4336B1516e',
    featured: false,
    dateWatched: '2023-12-10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 55).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_winter_soldier',
    title: 'Captain America: The Winter Soldier',
    posterUrl: 'https://image.tmdb.org/t/p/w780/tVFRpFw3xTed5nGQqW0SdKGMWPA.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7SlglYF28r9uNn1F5t18kK1qQ2H.jpg',
    personalRating: 9.7,
    imdbRating: 7.8,
    duration: '2h 16m',
    contentType: 'movie',
    releaseYear: 2014,
    category: 'Marvel',
    subCategory: 'Phase 2',
    description: 'As Steve Rogers struggles to embrace his role in the modern world, he teams up with Black Widow and Falcon to battle a new threat from history: an assassin known as the Winter Soldier.',
    personalReview: 'The best standalone action thriller in the MCU. Gritty hand-to-hand combat, incredible highway knife fight, and sharp 70s spy-thriller direction by the Russo Brothers.',
    watchUrl: 'https://www.disneyplus.com/movies/captain-america-the-winter-soldier/3j4336B1516e',
    featured: true,
    dateWatched: '2024-01-20',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_civil_war',
    title: 'Captain America: Civil War',
    posterUrl: 'https://image.tmdb.org/t/p/w780/rAG29qAGjHAo07Lp7bXg9g4iYlC.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7FWGGmB91zP2Y5G2Lp6q2u3dK5Y.jpg',
    personalRating: 9.3,
    imdbRating: 7.8,
    duration: '2h 27m',
    contentType: 'movie',
    releaseYear: 2016,
    category: 'Marvel',
    subCategory: 'Phase 3',
    description: 'Political involvement in the Avengers\' affairs causes a rift between Captain America and Iron Man, pitting former friends against one another in an all-out ideological civil war.',
    personalReview: 'Avengers 2.5 in everything but name. The Leipzig airport battle and the raw emotional finale in Siberia deliver genuine character stakes.',
    watchUrl: 'https://www.disneyplus.com/movies/captain-america-civil-war/4k4336B1516e',
    featured: false,
    dateWatched: '2024-02-14',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_guardians_galaxy',
    title: 'Guardians of the Galaxy',
    posterUrl: 'https://image.tmdb.org/t/p/w780/r7vmZjiyZw9rpJMQJdXvlshvgpH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/uLtV5o5LNX7vM5bKVd0W3K6pQj8.jpg',
    personalRating: 9.4,
    imdbRating: 8.0,
    duration: '2h 01m',
    contentType: 'movie',
    releaseYear: 2014,
    category: 'Marvel',
    subCategory: 'Phase 2',
    description: 'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.',
    personalReview: 'Pure joy. James Gunn turned obscure D-list comic characters into beloved global icons. Awesome Mixtape Vol. 1 soundtrack is unmatched.',
    watchUrl: 'https://www.disneyplus.com/movies/guardians-of-the-galaxy/1n4336B1516e',
    featured: false,
    dateWatched: '2023-12-25',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_thor_ragnarok',
    title: 'Thor: Ragnarok',
    posterUrl: 'https://image.tmdb.org/t/p/w780/rzRwTcFvttcN1ZpX2xv4jvoY0FD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/kaIfm5ryEOwYg8pupqR8m9g9bSg.jpg',
    personalRating: 9.1,
    imdbRating: 7.9,
    duration: '2h 10m',
    contentType: 'movie',
    releaseYear: 2017,
    category: 'Marvel',
    subCategory: 'Phase 3',
    description: 'Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the ruthless villain Hela.',
    personalReview: 'Taika Waititi reinvented Thor with 80s synth-wave flair, Led Zeppelin\'s Immigrant Song, and hilarious banter with the Hulk and Loki.',
    watchUrl: 'https://www.disneyplus.com/movies/thor-ragnarok/9m4336B1516e',
    featured: false,
    dateWatched: '2024-02-28',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_black_panther',
    title: 'Black Panther',
    posterUrl: 'https://image.tmdb.org/t/p/w780/uxzzxijgPIY7slzFvMotPv8vlum.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/b6ZJZHUytAnAOKfloqFjhUpbhNu.jpg',
    personalRating: 9.0,
    imdbRating: 7.3,
    duration: '2h 14m',
    contentType: 'movie',
    releaseYear: 2018,
    category: 'Marvel',
    subCategory: 'Phase 3',
    description: 'T\'Challa, heir to the hidden kingdom of Wakanda, must step forward to lead his people into a new future and confront a challenger from his country\'s past.',
    personalReview: 'Chadwick Boseman is regal and unforgettable. Michael B. Jordan\'s Killmonger is one of the most compelling and nuanced antagonists ever written.',
    watchUrl: 'https://www.disneyplus.com/movies/black-panther/6j4336B1516e',
    featured: false,
    dateWatched: '2024-03-02',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 32).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_loki_series',
    title: 'Loki',
    posterUrl: 'https://image.tmdb.org/t/p/w780/voHUmlvjysvFlBYemKG2gqsm5Lg.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/k47JEUTQsSMN539ygcqap7Pmn1B.jpg',
    personalRating: 9.8,
    imdbRating: 8.2,
    duration: 'Season 2 Finale',
    contentType: 'series',
    episodeName: 'S02E06: Glorious Purpose',
    episodeInfo: '2 Seasons • 12 Episodes',
    releaseYear: 2021,
    category: 'Marvel',
    subCategory: 'Disney+ Series',
    description: 'The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame. Traveling through timelines with the TVA, Loki learns the burden of destiny.',
    personalReview: 'Easily the greatest Marvel series ever produced. Tom Hiddleston\'s redemption arc into the God of Stories holding the timelines together gave genuine chills.',
    watchUrl: 'https://www.disneyplus.com/series/loki/6p4336B1516e',
    featured: true,
    dateWatched: '2024-04-15',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_wandavision_series',
    title: 'WandaVision',
    posterUrl: 'https://image.tmdb.org/t/p/w780/glKDss7S79UrWMkx09ioBh0KPt6.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/57vVugvHGZBLPd3wwwhV5T3b5uy.jpg',
    personalRating: 9.2,
    imdbRating: 7.9,
    duration: 'Episode 9',
    contentType: 'series',
    episodeName: 'Ep 9: The Series Finale',
    episodeInfo: 'Miniseries • 9 Episodes',
    releaseYear: 2021,
    category: 'Marvel',
    subCategory: 'Disney+ Series',
    description: 'Blends the style of classic sitcoms with the MCU, in which Wanda Maximoff and Vision - two super-powered beings living their ideal suburban lives - begin to suspect that everything is not as it seems.',
    personalReview: 'Brilliant exploration of grief, sitcom homage through the decades, and Elizabeth Olsen\'s transformation into the Scarlet Witch.',
    watchUrl: 'https://www.disneyplus.com/series/wandavision/4p4336B1516e',
    featured: false,
    dateWatched: '2024-02-10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mcu_moon_knight',
    title: 'Moon Knight',
    posterUrl: 'https://image.tmdb.org/t/p/w780/x6FsYvt33846Gqi2is9fc2gZa5w.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    personalRating: 9.0,
    imdbRating: 7.3,
    duration: 'Episode 6',
    contentType: 'series',
    episodeName: 'Ep 6: Gods and Monsters',
    episodeInfo: 'Miniseries • 6 Episodes',
    releaseYear: 2022,
    category: 'Marvel',
    subCategory: 'Disney+ Series',
    description: 'Steven Grant discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven and Marc\'s enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt.',
    personalReview: 'Oscar Isaac gives an absolute masterclass acting performance playing Steven Grant, Marc Spector, and Jake Lockley. Psychological depth with Egyptian mythology.',
    watchUrl: 'https://www.disneyplus.com/series/moon-knight/7j4336B1516e',
    featured: false,
    dateWatched: '2024-03-25',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('Seeding Marvel category...');
  await setDoc(doc(db, 'categories', MARVEL_CATEGORY.id), MARVEL_CATEGORY, { merge: true });
  console.log('Category "Marvel" seeded successfully!');

  console.log(`Seeding ${MCU_MOVIES.length} MCU movies and series...`);
  for (const movie of MCU_MOVIES) {
    await setDoc(doc(db, 'movies', movie.id), movie, { merge: true });
    console.log(`Saved: ${movie.title}`);
  }
  console.log('All Marvel movies and series seeded successfully into Firestore!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
