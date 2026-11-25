import TopicPage from "./TopicPage";

const data = [
  {
    question: "What are nebulas?",
    answer:
      "Nebulas are vast clouds of dust and gas in space. They can be regions where new stars are forming or the remnants of dead or dying stars.",
  },
  {
    question: "How are nebulas formed?",
    answer:
      "Nebulas are formed from the remnants of supernova explosions or by the gravitational collapse of gas and dust in space.",
  },
  {
    question: "What are the different types of nebulas?",
    answer:
      "There are several types of nebulas, including emission nebulae, reflection nebulae, and dark nebulae. Each type has unique characteristics and is formed under different conditions.",
  },
  {
    question: "What is the Orion Nebula?",
    answer:
      "The Orion Nebula is a famous emission nebula located in the constellation Orion. It is one of the brightest nebulae visible to the naked eye and is a region of active star formation.",
  },
  {
    question: "What do nebulas tell us about the universe?",
    answer:
      "Studying nebulas can provide valuable insights into the processes of star formation, the life cycles of stars, and the chemical composition of the universe.",
  },
  {
    question: "Are nebulas dangerous?",
    answer:
      "Nebulas are not dangerous to humans. While some nebulas may contain radiation or other hazards, they are typically so far away from Earth that they pose no threat.",
  },
];
const discovermore = [
  {
    title: "GALAXIES",
    imageUrl:
      "https://images.pexels.com/photos/821644/pexels-photo-821644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "BLACK HOLE",
    imageUrl:
      "https://science.nasa.gov/wp-content/uploads/2023/06/blackhole-binary-mainsequence-jpg.webp?w=1536&format=webp",
  },
  {
    title: "STARS",
    imageUrl:
      "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2dldHR5aW1hZ2VzLTE0MDYxNzQxMjEuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoiMTIwMCJ9fX0=",
  },
  {
    title: "SOLAR SYSTEM",
    imageUrl: "https://cdn.mos.cms.futurecdn.net/v5n22xGyNNHLzSnSArbrVH.jpg",
  },
];

const blocks = [
  {
    type: "image",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hs-2009-25-e-full.jpg/800px-Hs-2009-25-e-full.jpg",
    alt: "A nebula photographed by Hubble",
  },
  { type: "h2", text: "Overview" },
  {
    type: "text",
    text: "Delve into the captivating realms of space where beauty and mystery intertwine – nebulae. These celestial phenomena, characterized by their stunning displays of light and color, are among the most mesmerizing sights in the cosmos. Join us on a journey to unravel the secrets of these cosmic clouds and uncover the wonders they hold.",
  },
  { type: "h2", text: "What are Nebulae?" },
  {
    type: "text",
    text: "Nebulae are vast clouds of gas and dust scattered throughout galaxies, ranging in size from just a few light-years across to hundreds of light-years. They serve as stellar nurseries, where new stars are born, and as the graves of old stars, where they cast off their outer layers in spectacular displays of cosmic recycling.",
  },
  { type: "h2", text: "Types of Nebulae" },
  { type: "h3", text: "Emission Nebulae" },
  {
    type: "image",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ring_Nebula.jpg/330px-Ring_Nebula.jpg",
    alt: "Emission nebula",
  },
  {
    type: "text",
    text: "These nebulae glow brightly as a result of radiation from nearby stars, often appearing red or pink due to the presence of hydrogen gas.",
  },
  { type: "h3", text: "Reflection Nebulae" },
  {
    type: "image",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJPmTqXPzt38ioIQ-3eouFZk6KD1yuptLHizyAJN-WUw&s",
    alt: "Reflection nebula",
  },
  {
    type: "text",
    text: "These nebulae shine by reflecting the light of nearby stars, appearing blue because they scatter shorter wavelengths of light more effectively than longer ones.",
  },
  { type: "h3", text: "Dark Nebulae" },
  {
    type: "image",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/All_Quiet_in_the_Nursery%3F.jpg/495px-All_Quiet_in_the_Nursery%3F.jpg",
    alt: "Dark nebula",
  },
  {
    type: "text",
    text: "Also known as absorption nebulae, these clouds of gas and dust block the light from objects behind them, creating striking silhouettes against the backdrop of space.",
  },
  { type: "h3", text: "Planetary Nebulae" },
  {
    type: "image",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/NGC_6326_by_Hubble_Space_Telescope.jpg/330px-NGC_6326_by_Hubble_Space_Telescope.jpg",
    alt: "Planetary nebula NGC 6326",
  },
  {
    type: "text",
    text: "Despite their name, these nebulae have nothing to do with planets. They are formed when dying stars shed their outer layers, creating intricate and often symmetrical structures.",
  },
  { type: "h3", text: "Supernova Remnants" },
  {
    type: "image",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/450px-Crab_Nebula.jpg",
    alt: "Crab Nebula supernova remnant",
  },
  {
    type: "text",
    text: "The remnants of massive stars that have exploded in supernova events, these nebulae are crucial to our understanding of stellar evolution and the dispersal of elements throughout the universe.",
  },
  { type: "h2", text: "Formation and Evolution" },
  {
    type: "text",
    text: [
      "Nebulae, those captivating cosmic clouds, come into existence through a variety of intricate processes, each contributing to their awe-inspiring beauty and scientific significance.",
      "Firstly, the gravitational collapse of massive gas clouds initiates the birth of nebulae. These clouds, often composed primarily of hydrogen gas with traces of other elements, gradually coalesce under the influence of gravity. As the gas particles draw closer together, their gravitational potential energy is converted into heat, raising the temperature within the cloud. Eventually, this process triggers the onset of nuclear fusion in the core, marking the birth of a new star. Surrounding this nascent star, the remaining gas and dust form a nebula, acting as a stellar nursery where the star's siblings may also form.",
      "Additionally, shockwaves from supernova explosions play a crucial role in the formation of nebulae. When a massive star reaches the end of its life cycle, it undergoes a catastrophic explosion known as a supernova. The immense energy released in this explosion sends shockwaves rippling through the surrounding interstellar medium, compressing gas and dust clouds and triggering their collapse. These shockwaves can also induce the formation of new stars within the nebula, further enriching its complexity.",
    ],
  },
  { type: "h2", text: "Notable Nebulae" },
  {
    type: "mediaList",
    items: [
      {
        text: "The Orion Nebula : Located in the constellation of Orion, this emission nebula is one of the brightest and most well-known in the night sky, visible even to the naked eye.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/450px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
        alt: "Orion Nebula",
      },
      {
        text: "The Crab Nebula : This supernova remnant, located in the constellation of Taurus, is the result of a supernova observed by Chinese astronomers in 1054 AD. It remains one of the most studied objects in the sky.",
        image: "https://d2pn8kiwq2w21t.cloudfront.net/original_images/1-Webb_Crab_Nebula-resize.webp",
        alt: "Crab Nebula",
      },
      {
        text: 'The Eagle Nebula : Famous for its "Pillars of Creation," this emission nebula in the constellation of Serpens is a stellar nursery where new stars are actively forming.',
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/450px-Eagle_Nebula_from_ESO.jpg",
        alt: "Eagle Nebula",
      },
    ],
  },
];

export default function Nebulas({ setSelectedNews }) {
  return (
    <TopicPage
      blocks={blocks}
      topic="nebulas"
      newsHeading="Related nebulae news"
      faqs={data}
      discover={discovermore}
      setSelectedNews={setSelectedNews}
    />
  );
}
