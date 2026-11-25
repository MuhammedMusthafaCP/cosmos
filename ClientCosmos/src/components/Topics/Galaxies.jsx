import TopicPage from "./TopicPage";

const data = [
  {
    question: "What are galaxies?",
    answer:
      "Galaxies are vast systems of stars, gas, dust, and dark matter held together by gravity. They come in different shapes and sizes and contain billions to trillions of stars.",
  },
  {
    question: "How do galaxies form?",
    answer:
      "Galaxies form through the gravitational collapse of gas and dust in the early universe. Over time, smaller galaxies merge to form larger ones, contributing to the diversity of galaxy shapes and sizes.",
  },
  {
    question: "What are the different types of galaxies?",
    answer:
      "There are several types of galaxies, including spiral galaxies, elliptical galaxies, and irregular galaxies. Spiral galaxies have a distinct spiral structure, elliptical galaxies are more rounded in shape, and irregular galaxies have no definite shape.",
  },
  {
    question: "What is the Milky Way?",
    answer:
      "The Milky Way is the galaxy that contains our solar system. It is a barred spiral galaxy with a central bulge and spiral arms extending from it.",
  },
  {
    question: "How many galaxies are there in the universe?",
    answer:
      "There are estimated to be billions to trillions of galaxies in the observable universe. The exact number is difficult to determine due to the vastness of space.",
  },
  {
    question: "What do galaxies tell us about the universe?",
    answer:
      "Studying galaxies can provide insights into the formation, evolution, and structure of the universe. They contain valuable information about the distribution of matter and the dynamics of cosmic processes.",
  },
];
const discovermore = [
  {
    title: "BLACK HOLE",
    imageUrl:
      "https://assets.newatlas.com/dims4/default/942c058/2147483647/strip/true/crop/3240x2160+300+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F89%2F8e%2Fd8cd992244949347b56b2b77fc97%2Fblack-hole-disc.jpg",
  },
  {
    title: "NEBULAS",
    imageUrl:
      "https://www.nasa.gov/wp-content/uploads/2022/10/stsci-01gfnn3pwjmy4rqxkz585bc4qh.png",
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
    text: `Galaxies consist of stars, planets, and vast clouds of gas and dust, all bound together by gravity. The largest contain trillions of stars and can be more than a million light-years across. The smallest can contain a few thousand stars and span just a few hundred light-years. Most large galaxies have supermassive black holes at their centers, some with billions of times the Sun’s mass. Galaxies come in a variety of shapes, mostly spirals and ellipticals, as well as those with less orderly appearances, usually dubbed irregular. Most galaxies are between 10 billion and 13.6 billion years old. Some are almost as old as the universe itself, which formed around 13.8 billion years ago. Astronomers think the youngest known galaxy formed approximately 500 million years ago. Galaxies can organize into groups of about 100 or fewer members held together by their mutual gravity. Larger structures, called clusters, may contain thousands of galaxies. Groups and clusters can be arranged in superclusters, which are not gravitationally bound. Superclusters, empty voids, “walls” of galaxies, and other large-scale structures make up the cosmic web of matter in the universe.`,
  },
  {
    type: "video",
    intro: "Here is a video that provides a comprehensive overview of galaxies.",
    src: "https://www.youtube.com/embed/VXcnG06GmcY?si=OrGhhs0eX_4lhqA8",
    title: "Overview of galaxies",
    credit: "Credits - Nasa",
  },
  { type: "h2", text: "Our Milky Way" },
  {
    type: "text",
    text: "Our home galaxy is called the Milky Way. It’s a spiral galaxy with a disk of stars spanning more than 100,000 light-years. Earth is located along one of the galaxy’s spiral arms, about halfway from the center. Our solar system takes about 240 million years to orbit the Milky Way just once.",
  },
  {
    type: "image",
    src: "https://science.nasa.gov/wp-content/uploads/2023/09/Milky_Way_illustration-1.jpeg?w=1536&format=webp",
    alt: "Milky Way",
  },
  {
    type: "text",
    text: "From our perspective on Earth, the Milky Way looks like a faint, milky band of light arcing across the entire sky, which is how it got its name. This feature marks the central disk of our home galaxy seen edge on. The Milky Way sits in a neighborhood with over 50 other galaxies called the Local Group. Its members range in size from dwarf galaxies (smaller galaxies with up to a few billion stars) to Andromeda, our nearest large galactic neighbor. The Local Group sits just off the edge of the Virgo cluster and is part of the Laniakea supercluster.",
  },
  { type: "h2", text: "Galaxy Formation and Evolution" },
  {
    type: "image",
    src: "https://www.researchgate.net/publication/363529923/figure/fig2/AS:11431281124900565@1678137342065/Modern-concept-of-the-formation-and-evolution-of-giant-elliptical-galaxies-Illustration.ppm",
    alt: "Formation and evolution of giant elliptical galaxies",
  },
  {
    type: "text",
    text: "Galaxies form and evolve through a combination of processes, including the merging of smaller protogalaxies, the accretion of gas, and interactions with other galaxies. The earliest galaxies formed from density fluctuations in the early universe, leading to the formation of stars and star clusters. Over billions of years, these star clusters merged to form the galaxies we see today. Galaxy collisions and mergers are common and play a significant role in shaping galaxies. For example, the Milky Way has absorbed several smaller galaxies over its history and will continue to do so in the future.",
  },
  { type: "h2", text: "Dark Matter and Galaxies" },
  {
    type: "image",
    src: "https://science.nasa.gov/wp-content/uploads/2023/04/macs_j1149-2223-jpg.webp?w=1536&format=webp",
    alt: "Gravitational lensing by a galaxy cluster",
  },
  {
    type: "text",
    text: "Large galaxy clusters contain both dark matter and normal matter. The immense gravity of all this material warps the space around the cluster, causing the light from objects located behind the cluster to be distorted and magnified. This phenomenon is called gravitational lensing. This sketch shows paths of light from a distant galaxy that is being gravitationally lensed by a foreground cluster.",
  },
  { type: "h2", text: "Galaxy Interactions and Collisions" },
  {
    type: "text",
    text: "Galaxy interactions and collisions are common events in the universe and play a crucial role in shaping galaxies. When galaxies pass close to each other, their mutual gravitational attraction can cause them to interact, distorting their shapes and triggering star formation. These interactions can result in various outcomes, such as the merging of galaxies to form a single, larger galaxy or the creation of tidal tails, which are streams of stars and gas pulled out from the galaxies.",
  },
  {
    type: "image",
    src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipW195Y7N-FvZs0o3q3thwRHsUSLdPMjJeZN-vdJN_YMaorjiFFB4zXZQNTo-YXpCfB-oGa2kj6MrRKxwA852PZY6UMT3PLehCtgBPSt-e9u5yy5MxOR2WKQ3pS1O18vcL4kxnyNCZqiw/s1600/ngc4676.jpg",
    alt: "Irregular Galaxy",
  },
  {
    type: "text",
    text: "One of the most famous examples of interacting galaxies is the Antennae Galaxies (NGC 4038 and NGC 4039), which are in the process of merging. Their collision has created a spectacular array of new stars and star clusters. Another well-known interaction is between the Milky Way and the Andromeda Galaxy, which are expected to merge in about 4.5 billion years.",
  },
  { type: "h2", text: "Essential Galaxy Facts" },
  {
    type: "facts",
    items: [
      { title: "NEAREST", text: "The closest galaxy to the Milky Way is the Andromeda Galaxy, located about 2.537 million light-years away." },
      { title: "FARTHEST", text: "The most distant known galaxy, GN-z11, is approximately 13.4 billion light-years away from Earth." },
      { title: "BIGGEST", text: "IC 1101 is the largest known galaxy, with a diameter of about 6 million light-years, containing up to 100 trillion stars." },
      { title: "SMALLEST", text: "Segue 2 is one of the smallest known galaxies, with a mere 1,000 stars and a diameter of about 110 light-years." },
      { title: "SHAPE", text: "Galaxies come in various shapes: spiral (like the Milky Way), elliptical, and irregular. Their shape often depends on their age and interactions." },
      { title: "COLLISIONS", text: "Galaxies can collide and merge, creating larger galaxies. The Milky Way is expected to collide with the Andromeda Galaxy in about 4.5 billion years." },
      { title: "DARK MATTER", text: "Galaxies are thought to be surrounded by dark matter, an invisible substance that makes up about 85% of the total mass of the universe." },
      { title: "STAR FORMATION", text: "Star formation occurs in galaxies, especially in spiral arms. The rate of star formation can vary widely between different types of galaxies." },
      { title: "SUPER-MASSIVE BLACK HOLES", text: "Most galaxies, including the Milky Way, have super-massive black holes at their centers. The one at the center of our galaxy is called Sagittarius A*." },
    ],
  },
  { type: "h2", text: "Types of Galaxies" },
  {
    type: "text",
    text: "Galaxies come in various shapes and sizes, typically categorized into three main types: spiral, elliptical, and irregular.",
  },
  { type: "h3", text: "Spiral Galaxies" },
  {
    type: "text",
    text: `Spiral galaxies, like the Milky Way, have a flat, rotating disk containing stars, gas, and dust, along with a central concentration of stars known as the bulge. The disk is often organized into spiral arms that extend from the center. These arms are sites of active star formation and are brighter than the surrounding disk. Spiral galaxies are classified into two subcategories: normal spirals (designated with an "S") and barred spirals (designated with an "SB"), which have a central bar-shaped structure made of stars.`,
  },
  {
    type: "image",
    src: "https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcRIl-T0A7cDIftdsm7mM7Odh0nkVAFud6G0wauDhZ0j3F7Eqfi4y-av6IkTnpqm1BCy",
    alt: "Spiral Galaxy",
  },
  { type: "h3", text: "Elliptical Galaxies" },
  {
    type: "text",
    text: `Elliptical galaxies have an ellipsoidal shape and a smooth, nearly featureless appearance. They range in shape from nearly spherical to highly elongated and contain older, low-mass stars with little gas and dust, resulting in minimal new star formation. Elliptical galaxies are designated with an "E" followed by a number indicating their degree of elongation (e.g., E0 for nearly spherical to E7 for highly elongated).`,
  },
  {
    type: "image",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Ob-sGZqtiSK_N_mOJRZxCXmvQMLmYFoFng&s",
    alt: "Elliptical Galaxy",
  },
  { type: "h3", text: "Irregular Galaxies" },
  {
    type: "text",
    text: "Irregular galaxies do not have a distinct shape like spiral or elliptical galaxies. They are often chaotic in appearance, with no central bulge or spiral arms. Irregular galaxies are rich in gas and dust, making them sites of active star formation. They are usually smaller and less massive than spiral and elliptical galaxies. Examples include the Large and Small Magellanic Clouds, which are satellite galaxies of the Milky Way.",
  },
  {
    type: "image",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG2ylM0TGKNgZHkzhyl-SK9xONGEoQxJzyWA&s",
    alt: "Irregular Galaxy",
  },
  { type: "h2", text: "Current Research and Discoveries" },
  {
    type: "text",
    text: "Current research in galaxy formation and evolution focuses on understanding the role of dark matter, the impact of supermassive black holes on galaxy dynamics, and the processes that drive star formation. Observatories such as the Hubble Space Telescope, the James Webb Space Telescope, and ground-based telescopes provide critical data for these studies. Recent discoveries include the detection of the most distant galaxies, the observation of galaxy mergers, and insights into the behavior of dark matter.",
  },
];

const hero = {
  image: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  title: "GALAXIES",
};

export default function Galaxies({ setSelectedNews }) {
  return (
    <TopicPage
      hero={hero}
      blocks={blocks}
      topic="galaxies"
      newsHeading="Related galaxy news"
      faqs={data}
      discover={discovermore}
      setSelectedNews={setSelectedNews}
    />
  );
}
