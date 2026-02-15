const { Description, BorderAll, BorderAllRounded, BorderColor, BorderStyle } = require("@mui/icons-material");

let cards = [
  {
    id: 1,
    title: "Giornata di apertura",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    Image: "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?cs=srgb&dl=pexels-christian-heitz-285904-842711.jpg&fm=jpg",
    textcolor: "#6a6956",
  },
  {
    id: 2,
    title: "Giornata di chiusura",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    backgroundImage: "https://external-preview.redd.it/Z3AoSYd0lMvins0SV_gt99qHbu2nLTkUGh5CMBhy28E.jpg?auto=webp&s=7ff397141e46f77d97fcf80354d99c885b21a0f5",
    textcolor: "#ffffff",
    backgroundColor: "#b8941d"
  },
    {
    id: 3,
    title: "Giornata della pace",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    backgroundImage: "https://i.redd.it/4gma9c4xaga61.jpg",
    textcolor: "#000000",
    backgroundColor: "#b8941d"
  },
    {
    id: 4,
    title: "Giornata della memoria",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    backgroundImage: "https://server.wallpaperalchemy.com/storage/wallpapers/115/4k-mountain-lake-wallpaper.jpeg",
    textcolor: "#000000",
    backgroundColor: "#b8941d"
  },
];

export default function handler(req, res) {
  res.status(200).json(cards);
}