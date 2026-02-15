const { Description } = require("@mui/icons-material");

let cards = [
  {
    id: 1,
    title: "Giornata di apertura",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    backgroundColor: "#f650907c",
  },
  {
    id: 2,
    title: "Giornata di chiusura",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    backgroundColor: "#fb9b2c80",
  },
    {
    id: 3,
    title: "Giornata della pace",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.",
    backgroundColor: "#34b8e090",
  },
];

export default function handler(req, res) {
  res.status(200).json(cards);
}