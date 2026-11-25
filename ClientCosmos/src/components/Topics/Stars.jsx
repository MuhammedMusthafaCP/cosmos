import TopicPage from "./TopicPage";

const discovermore = [
  {
    title: "GALAXIES",
    imageUrl:
      "https://images.pexels.com/photos/821644/pexels-photo-821644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "SOLAR SYSTEM",
    imageUrl: "https://cdn.mos.cms.futurecdn.net/v5n22xGyNNHLzSnSArbrVH.jpg",
  },
  {
    title: "NEBULAS",
    imageUrl:
      "https://bsmedia.business-standard.com/_media/bs/img/about-page/thumb/464_464/1605599664.jpg",
  },
  {
    title: "BLACK HOLE",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/330px-Black_hole_-_Messier_87_crop_max_res.jpg",
  },
];
const data = [
  {
    question: "What are stars made of?",
    answer:
      "Stars are primarily composed of hydrogen and helium, with trace amounts of other elements.",
  },
  {
    question: "How do stars form?",
    answer:
      "Stars form from massive clouds of gas and dust called nebulae. Gravitational forces cause the material in the nebulae to condense and heat up, eventually triggering nuclear fusion and the birth of a star.",
  },
  {
    question: "What are the 7 main types of stars ?",
    answer:
      "There are seven main types of stars: O, B, A, F, G, K and M. The O stars are the bright, hot, blue stars and the M stars are the dimmer, cooler, red stars. A common mnemonic for remembering the order of the classifications is: 'Oh Be A Fine Girl, Kiss Me.",
  },
  {
    question: "What defines a star?",
    answer:
      "A star is any massive self-luminous celestial body of gas that shines by radiation derived from its internal energy sources. Of the tens of billions of trillions of stars in the observable universe, only a very small percentage are visible to the naked eye.",
  },
  {
    question: "What are stars made of? ?",
    answer:
      "Stars are giant balls of hot gas - mostly hydrogen, with some helium and small amounts of other elements. Every star has its own life cycle, ranging from a few million to trillions of years, and its properties change as it ages.",
  },
  {
    question: "What is the smallest star? ",
    answer:
      "In 2017, an international team of astronomers announced the discovery of a so-called red dwarf star that's so small it barely functions as a star. Code-named EBLM J0555-57Ab and lying some 600 light-years away, it's similar in size to the planet Saturn.",
  },
];

const blocks = [
  {
    type: "text",
    text: "A star is a luminous spheroid of plasma held together by self-gravity. The nearest star to Earth is the Sun. Many other stars are visible to the naked eye at night; their immense distances from Earth make them appear as fixed points of light. The most prominent stars have been categorised into constellations and asterisms, and many of the brightest stars have proper names. Astronomers have assembled star catalogues that identify the known stars and provide standardized stellar designations. The observable universe contains an estimated 10^22 to 10^24 stars. Only about 4,000 of these stars are visible to the naked eye—all within the Milky Way galaxy.",
  },
  { type: "h2", text: "BIRTH" },
  {
    type: "text",
    text: "Stars form in large clouds of gas and dust called molecular clouds. Molecular clouds range from 1,000 to 10 million times the mass of the Sun and can span as much as hundreds of light-years. Molecular clouds are cold which causes gas to clump, creating high-density pockets. Some of these clumps can collide with each other or collect more matter, strengthening their gravitational force as their mass grows. Eventually, gravity causes some of these clumps to collapse. When this happens, friction causes the material to heat up, which eventually leads to the development of a protostar – a baby star. Batches of stars that have recently formed from molecular clouds are often called stellar clusters, and molecular clouds full of stellar clusters are called stellar nurseries.",
  },
  {
    type: "image",
    src: "https://science.nasa.gov/wp-content/uploads/2023/09/Carina_Nebula-1.jpeg?w=1536&format=webp",
    alt: "Carina Nebula, a stellar nursery",
  },
  { type: "h2", text: "LIFE" },
  {
    type: "text",
    text: "At first, most of the protostar’s energy comes from heat released by its initial collapse. After millions of years, immense pressures and temperatures in the star’s core squeeze the nuclei of hydrogen atoms together to form helium, a process called nuclear fusion. Nuclear fusion releases energy, which heats the star and prevents it from further collapsing under the force of gravity.",
  },
  {
    type: "image",
    src: "https://science.nasa.gov/wp-content/uploads/2023/09/Sun_Emits_Flare.jpeg?w=1536&format=webp",
    alt: "The Sun emitting a flare",
  },
  {
    type: "text",
    text: [
      "Astronomers call stars that are stably undergoing nuclear fusion of hydrogen into helium main sequence stars. This is the longest phase of a star’s life. The star’s luminosity, size, and temperature will slowly change over millions or billions of years during this phase. Our Sun is roughly midway through its main sequence stage.",
      "A star’s gas provides its fuel, and its mass determines how rapidly it runs through its supply, with lower-mass stars burning longer, dimmer, and cooler than very massive stars. More massive stars must burn fuel at a higher rate to generate the energy that keeps them from collapsing under their own weight. Some low-mass stars will shine for trillions of years – longer than the universe has currently existed – while some massive stars will live for only a few million years.",
    ],
  },
  { type: "h2", text: "DEATH" },
  {
    type: "text",
    text: [
      "At the beginning of the end of a star’s life, its core runs out of hydrogen to convert into helium. The energy produced by fusion creates pressure inside the star that balances gravity’s tendency to pull matter together, so the core starts to collapse. But squeezing the core also increases its temperature and pressure, making the star slowly puff up. However, the details of the late stages of the star’s death depend strongly on its mass.",
      "A low-mass star’s atmosphere will keep expanding until it becomes a subgiant or giant star while fusion converts helium into carbon in the core. (This will be the fate of our Sun, in several billion years.) Some giants become unstable and pulsate, periodically inflating and ejecting some of their atmospheres. Eventually, all the star’s outer layers blow away, creating an expanding cloud of dust and gas called a planetary nebula.",
    ],
  },
  {
    type: "image",
    src: "https://cdn.britannica.com/92/124492-050-047F11FB/image-Kepler-Nova-Keplers-Supernova-Chandra-X-ray.jpg",
    alt: "Kepler's Supernova remnant seen by Chandra",
  },
  {
    type: "text",
    text: [
      "All that’s left of the star is its core, now called a white dwarf, a roughly Earth-sized stellar cinder that gradually cools over billions of years.",
      "A high-mass star goes further. Fusion converts carbon into heavier elements like oxygen, neon, and magnesium, which will become future fuel for the core. For the largest stars, this chain continues until silicon fuses into iron. These processes produce energy that keeps the core from collapsing, but each new fuel buys it less and less time. The whole process takes just a few million years. By the time silicon fuses into iron, the star runs out of fuel in a matter of days. The next step would be fusing iron into some heavier element but doing so requires energy instead of releasing it.",
      "The star’s iron core collapses until forces between the nuclei push the brakes, then it rebounds. This change creates a shock wave that travels outward through the star. The result is a huge explosion called a supernova. The core survives as an incredibly dense remnant, either a neutron star or a black hole. Material cast into the cosmos by supernovae and other stellar events will enrich future molecular clouds and become incorporated into the next generation of stars.",
    ],
  },
];

const hero = {
  image: "https://science.nasa.gov/wp-content/uploads/2023/09/star-banner.webp?w=1600",
  title: "What is a Star?",
};

export default function Stars({ setSelectedNews }) {
  return (
    <TopicPage
      hero={hero}
      blocks={blocks}
      topic="stars"
      newsHeading="Related star news"
      faqs={data}
      discover={discovermore}
      setSelectedNews={setSelectedNews}
    />
  );
}
