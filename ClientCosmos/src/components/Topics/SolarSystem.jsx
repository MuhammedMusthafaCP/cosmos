import TopicPage from "./TopicPage";

const data = [
  {
    question: "What are 9 planets in order?",
    answer:
      "In order of distance from the sun they are; Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto, which until recently was considered to be the farthest planet, is now classified as a dwarf planet. Additional dwarf planets have been discovered farther from the Sun than Pluto.",
  },
  {
    question: "Are there 8 or 9 planets in the solar system?",
    answer:
      "Our solar system is made up of a star—the Sun—eight planets, 146 moons, a bunch of comets, asteroids and space rocks, ice, and several dwarf planets, such as Pluto. The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Mercury is closest to the Sun. Neptune is the farthest.",
  },
];
const planets = [
  {
    name: "MERCURY",
    image:
      "https://cdn.mos.cms.futurecdn.net/fjbeeRiPRQjQNhizwy7cWX-1200-80.jpg",
  },
  {
    name: "VENUS",
    image:
      "https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcRtqGYOVmn7rlUHM47dO2MUGjjqp-NkClqUJ7QIxAwGAulcM5kvScQrZSkfglqd92ua",
  },
  {
    name: "EARTH",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/1024px-The_Blue_Marble_%28remastered%29.jpg",
  },
  {
    name: "MARS",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png",
  },
  {
    name: "JUPITER",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Jupiter_New_Horizons.jpg/290px-Jupiter_New_Horizons.jpg",
  },
  {
    name: "SATURN",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/800px-Saturn_during_Equinox.jpg",
  },
  {
    name: "URANUS",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Uranus_Voyager2_color_calibrated.png",
  },
  {
    name: "NEPTUNE",
    image:
      "https://cdn.mos.cms.futurecdn.net/PezBzd9Fehsq9XWgWMauVV-1200-80.jpg",
  },
];
const discovermore = [
  {
    title: "NEBULAS",
    imageUrl:
      "https://www.nasa.gov/wp-content/uploads/2022/10/stsci-01gfnn3pwjmy4rqxkz585bc4qh.png",
  },
  {
    title: "BLACK HOLE",
    imageUrl:
      "https://assets.newatlas.com/dims4/default/942c058/2147483647/strip/true/crop/3240x2160+300+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F89%2F8e%2Fd8cd992244949347b56b2b77fc97%2Fblack-hole-disc.jpg",
  },
  {
    title: "GALAXIES",
    imageUrl:
      "https://images.pexels.com/photos/821644/pexels-photo-821644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "STARS",
    imageUrl:
      "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2dldHR5aW1hZ2VzLTE0MDYxNzQxMjEuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoiMTIwMCJ9fX0=",
  },
];

const blocks = [
  { type: "h2", text: "Overview" },
  {
    type: "text",
    text: "The solar system has one star, eight planets, five dwarf planets, at least 290 moons, more than 1.3 million asteroids, and about 3,900 comets. It is located in an outer spiral arm of the Milky Way galaxy called the Orion Arm, or Orion Spur. Our solar system orbits the center of the galaxy at about 515,000 mph (828,000 kph). It takes about 230 million years to complete one orbit around the galactic center.",
  },
  {
    type: "wideImage",
    src: "https://science.nasa.gov/wp-content/uploads/2023/07/pia06890-our-solar-system-banner-1920x640-1.jpg?w=4096&format=jpeg",
    alt: "Our solar system banner",
  },
  {
    type: "text",
    text: "We call it the solar system because it is made up of our star, the Sun, and everything bound to it by gravity – the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets Pluto, Ceres, Makemake, Haumea, and Eris – along with hundreds of moons; and millions of asteroids, comets, and meteoroids.",
  },
  { type: "h2", text: "The Sun" },
  {
    type: "embed",
    src: "https://eyes.nasa.gov/apps/solar-system/#/sun?embed=true",
    title: "NASA Eyes on the Solar System: the Sun",
  },
  {
    type: "text",
    text: "The Sun is the star at the center of our solar system. It's a nearly perfect sphere of hot plasma, primarily composed of hydrogen and helium. It's about 4.6 billion years old and is the most important source of energy for life on Earth. The Sun's immense gravity holds the solar system together, and its energy fuels processes such as photosynthesis and weather patterns. It's also the primary driver of Earth's climate and weather systems.",
  },
  { type: "h2", text: "Planets" },
  {
    type: "text",
    text: "Planets are large celestial bodies that orbit stars and do not produce light of their own but instead reflect the light of their parent star. In our solar system, there are eight recognized planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. These planets vary in size, composition, and characteristics.",
  },
  { type: "gallery", items: planets },
  { type: "h2", text: "Moons (Natural Satellites)" },
  {
    type: "text",
    text: "Moons, also known as natural satellites, are objects that orbit planets, dwarf planets, or even other moons. They are held in orbit by the gravitational force exerted by the larger body they orbit. Moons vary widely in size, composition, and surface features.",
  },
  { type: "h3", text: "Types of Moons" },
  {
    type: "definitions",
    items: [
      {
        label: "Regular Moons :",
        text: "These are moons that orbit their parent planet in a relatively circular and stable orbit. Examples include Earth's moon (Luna) and Jupiter's largest moons, like Io, Europa, Ganymede, and Callisto.",
      },
      {
        label: "Irregular Moons :",
        text: "These moons have more eccentric orbits and are often captured asteroids or debris. They may have irregular shapes and are generally smaller compared to regular moons. An example is Phobos and Deimos, the two moons of Mars.",
      },
    ],
  },
  { type: "h3", text: "Essential Moon Facts" },
  {
    type: "facts",
    items: [
      { title: "LARGEST", text: "Ganymede, the largest moon of Jupiter and the largest moon in the solar system." },
      { title: "SMALLEST MOON", text: "Some of the smallest moons in the solar system include some of the irregular moons of the gas giants, which are often less than a few kilometers in diameter." },
      { title: "NOTABLE MOONS", text: "Apart from Earth's moon, other notable moons include Titan, the largest moon of Saturn and the only moon in the solar system with a significant atmosphere, and Io, one of the most volcanically active bodies in the solar system, also orbiting Jupiter." },
    ],
  },
  { type: "h2", text: "Asteroids" },
  {
    type: "image",
    src: "https://th-thumbnailer.cdn-si-edu.com/moAtK8DFsqJjY4Xmo0_9KR1fz1M=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/26/95/269501a4-6bc9-41ad-8bd9-5cb990becb4e/eros.jpg",
    alt: "Asteroid Eros",
  },
  {
    type: "text",
    text: "Asteroids are rocky objects that orbit the Sun, primarily found in the asteroid belt, which is situated between the orbits of Mars and Jupiter. They are remnants from the early formation of the solar system, often considered as leftover building blocks that never coalesced into planets. Asteroids vary greatly in size, shape, composition, and orbital characteristics.",
  },
  { type: "h2", text: "Comets" },
  {
    type: "image",
    src: "https://smd-cms.nasa.gov/wp-content/uploads/2023/07/Giotto_halley_br.jpg",
    alt: "Halley's Comet imaged by the Giotto spacecraft",
  },
  {
    type: "text",
    text: "Comets are frozen leftovers from the formation of the solar system, made of dust, rock, and ices. When a comet's orbit brings it close to the Sun, the heat turns its ices into gas and dust, creating a glowing atmosphere called a coma and often one or more long tails that always point away from the Sun.",
  },
  { type: "h2", text: "Dwarf Planets" },
  {
    type: "image",
    src: "https://science.nasa.gov/wp-content/uploads/2023/07/dwarf-planets.jpg?w=1920",
    alt: "Dwarf planets",
  },
  {
    type: "text",
    text: "Celestial bodies that orbit the Sun and are massive enough to be roughly spherical in shape but have not cleared their orbits of other debris. Pluto, formerly considered the ninth planet, was reclassified as a dwarf planet in 2006. Other examples include Eris, Haumea, and Makemake.",
  },
  { type: "h2", text: "Kuiper Belt and Oort Cloud" },
  {
    type: "image",
    src: "https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2014/12/kuiper_belt_and_oort_cloud_in_context/15106869-6-eng-GB/Kuiper_Belt_and_Oort_Cloud_in_context.jpg",
    alt: "Kuiper Belt and Oort Cloud in context",
  },
  {
    type: "text",
    text: "The Kuiper Belt is a doughnut-shaped region of icy bodies extending far beyond the orbit of Neptune. It is home to Pluto and Arrokoth. Both worlds were visited by NASA's New Horizons spacecraft. There may be millions of other icy worlds in the Kuiper Belt that were left over from the formation of our solar system. Scientists call these worlds Kuiper Belt objects (KBOs), or trans-Neptunian objects (TNOs). Trans-Neptunian objects are objects in our solar system that have an orbit beyond Neptune.",
  },
];

const hero = {
  image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Solar_System_true_color_%28captions%29.jpg",
  title: "The Solar System",
};

export default function SolarSystem({ setSelectedNews }) {
  return (
    <TopicPage
      hero={hero}
      blocks={blocks}
      topic="solar system"
      newsHeading="Related solar system news"
      faqs={data}
      discover={discovermore}
      setSelectedNews={setSelectedNews}
    />
  );
}
