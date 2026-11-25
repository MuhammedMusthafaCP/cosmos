import TopicPage from "./TopicPage";
import blackhole from "../../Assets/blackhole.webp";

const data = [
  {
    question: "What is inside the black hole ?",
    answer:
      "Black holes have two parts. There is the event horizon, which you can think of as the surface, though it's simply the point where the gravity gets too strong for anything to escape. And then, at the center, is the singularity. That's the word we use to describe a point that is infinitely small and infinitely dense.",
  },
  {
    question: "Is black hole a danger?",
    answer:
      "So, can this or any other black hole pose a threat to Earth? Not really. According to NASA, no black hole is close enough to be a danger to us. Plus, the sun is not massive enough to explode to form a black hole.",
  },
  {
    question: "What causes a black hole ?",
    answer:
      "Stellar black holes form when the center of a very massive star collapses in upon itself. This collapse also causes a supernova, or an exploding star, that blasts part of the star into space. Scientists think supermassive black holes formed at the same time as the galaxy they are in.",
  },
  {
    question: "Where is black hole in Earth ?",
    answer:
      "The nearest known black hole, called Gaia BH1, is about 1,500 light-years away.",
  },
];
const discovermore = [
  {
    title: "GALAXIES",
    imageUrl:
      "https://images.pexels.com/photos/821644/pexels-photo-821644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "NEBULAS",
    imageUrl:
      "https://bsmedia.business-standard.com/_media/bs/img/about-page/thumb/464_464/1605599664.jpg",
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
    type: "text",
    text: "A black hole is a region of spacetime where gravity is so strong that nothing, not even light and other electromagnetic waves, is capable of possessing enough energy to escape it.",
  },
  { type: "h2", text: "Einstein's theory of black holes" },
  {
    type: "text",
    text: "Einstein's theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of no escape is called the event horizon. A black hole has a great effect on the fate and circumstances of an object crossing it, but it has no locally detectable features according to general relativity. In many ways, a black hole acts like an ideal black body, as it reflects no light. Quantum field theory in curved spacetime predicts that event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass. This temperature is of the order of billionths of a kelvin for stellar black holes, making it essentially impossible to observe directly.",
  },
  { type: "h2", text: "Event Horizon" },
  {
    type: "image",
    src: "https://www.syfy.com/sites/syfy/files/styles/scale_600/public/blackhole_diagram.jpg",
    alt: "Black hole diagram",
  },
  {
    type: "text",
    text: "The boundary surrounding a black hole is called the event horizon. Once an object crosses this boundary, it cannot escape the black hole's gravitational pull. The event horizon is often described as the point of no return.",
  },
  { type: "h2", text: "Singularity" },
  {
    type: "image",
    src: "https://www.researchgate.net/profile/Jose-Collazos-Rozo/publication/370901965/figure/fig3/AS:11431281159967675@1684562028991/Illustration-of-a-black-hole-we-can-appreciate-the-event-horizon-and-singularity.jpg",
    alt: "Event horizon and singularity illustration",
  },
  {
    type: "text",
    text: "At the very center of a black hole lies a singularity, a point where matter is thought to be infinitely dense and the gravitational forces are infinitely strong. The laws of physics as we currently understand them break down at this point.",
  },
  { type: "h2", text: "Formation" },
  {
    type: "image",
    src: "https://cdn.britannica.com/50/62750-050-C12B4D5F/evolution.jpg",
    alt: "Stellar evolution leading to a black hole",
  },
  {
    type: "text",
    text: "Black holes can form in several ways. The most common process is through the collapse of a massive star after it has exhausted its nuclear fuel. This type of black hole is known as a stellar black hole. Other types include supermassive black holes, which are found at the centers of galaxies, and primordial black holes, which are hypothesized to have formed in the early universe.",
  },
  { type: "h2", text: "Detection" },
  {
    type: "image",
    src: "https://news.stanford.edu/__data/assets/image/0023/42746/ATT00001.png",
    alt: "Detecting a black hole",
  },
  {
    type: "text",
    text: "Although black holes cannot be observed directly (since light cannot escape them), their presence can be inferred by observing the behavior of nearby objects. For instance, scientists can detect X-rays emitted by material as it is heated and accelerated while falling into a black hole, or they can observe the gravitational effects on nearby stars and gas clouds.",
  },
  { type: "h2", text: "Types of Black Holes" },
  {
    type: "table",
    columns: ["Name", "Explanation", "Image"],
    rows: [
      {
        name: "Stellar Black Holes",
        text: "Formed by the gravitational collapse of a massive star after a supernova.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzBeDW0jdejnBt60bdb_wiGvCKEkiqt3xoRQ&s",
        alt: "Stellar Black Hole",
      },
      {
        name: "Supermassive Black Holes",
        text: "Found at the centers of galaxies, including our own Milky Way. They contain millions to billions of times the mass of our sun.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmz1Ov6RTb-NQy2pU-9jbpv64rdvoxQBU4bA&s",
        alt: "Supermassive Black Hole",
      },
      {
        name: "Intermediate Black Holes",
        text: "A potential class that lies between stellar and supermassive black holes, though their existence is still a subject of research.",
        image: "https://www.astronomy.com/wp-content/uploads/sites/2/2023/02/image_4606e47TucanaeBlackHole.jpg",
        alt: "Intermediate Black Hole",
      },
      {
        name: "Primordial Black Holes",
        text: "Hypothetical black holes that might have formed soon after the Big Bang.",
        image: "https://www.astronomy.com/uploads/2021/09/BlackHole-6.jpg",
        alt: "Primordial Black Hole",
      },
    ],
  },
  { type: "h2", text: "Hawking Radiation" },
  {
    type: "text",
    text: "Theoretical physicist Stephen Hawking proposed that black holes can emit radiation due to quantum effects near the event horizon. This radiation, known as Hawking radiation, could cause black holes to lose mass and eventually evaporate over time.",
  },
  { type: "h2", text: "Impact on Time" },
  {
    type: "text",
    text: "According to Einstein's theory of general relativity, the immense gravitational pull of a black hole significantly warps spacetime. This warping causes time to pass differently near a black hole compared to regions far from its influence. An observer near a black hole would experience time more slowly relative to an observer far away.",
  },
  { type: "h2", text: "Role in the Universe" },
  {
    type: "text",
    text: "Black holes play a crucial role in the dynamics of galaxies. Supermassive black holes, in particular, are believed to influence the formation and evolution of galaxies through their gravitational interactions and energetic phenomena such as jets and outflows.",
  },
  {
    type: "video",
    intro: "Here's a video for Exploring the Enigmatic World of Black Holes: A Scientific Journey",
    src: "https://www.youtube.com/embed/kOEDG3j1bjs?si=sZG9O5PgntbaoiH1",
    title: "Exploring the Enigmatic World of Black Holes",
  },
  { type: "h2", text: "Essential Black Hole Facts" },
  {
    type: "facts",
    items: [
      { title: "CLOSEST", text: "The nearest known black hole, called Gaia BH1, is about 1,500 light-years away." },
      { title: "FARTHEST", text: "The most distant black hole detected, at the center of a galaxy called QSO J0313-1806, is around 13 billion light-years away." },
      { title: "BIGGEST", text: "The most massive black hole observed, TON 618, tips the scales at 66 billion times the Sun’s mass." },
      { title: "SMALLEST", text: "The lightest-known black hole is only 3.8 times the Sun’s mass. It’s paired up with a star." },
      { title: "SPAGHETTIFICATION", text: "A real term that describes what happens when matter gets too close to a black hole. It’s squeezed horizontally and stretched vertically, resembling a noodle." },
      { title: "SPIN", text: "All black holes spin. The fastest-known – named GRS 1915+105 – clocks in at over 1,000 rotations per second." },
      { title: "GRAVITY'S THE SAME", text: "If you replaced the Sun with a black hole of the same mass, the solar system would get a lot colder, but the planets would stay in their orbits." },
      { title: "STAR BOOMS", text: "One type of black hole is born when massive stars run out of fuel and explode in supernovae." },
      { title: "NOT SO RARE", text: "Most Milky Way-sized galaxies have monster black holes at their centers. Our is called Sagittarius A* (pronounced ey-star), and it’s 4 million times the Sun’s mass." },
    ],
  },
];

const hero = { image: blackhole, title: "What is a Black Hole?" };

export default function BlackHoles({ setSelectedNews }) {
  return (
    <TopicPage
      hero={hero}
      blocks={blocks}
      topic="black holes"
      newsHeading="Related black hole news"
      faqs={data}
      discover={discovermore}
      setSelectedNews={setSelectedNews}
    />
  );
}
