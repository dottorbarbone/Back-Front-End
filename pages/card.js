import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
export default function CardsPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <Typography variant="h4" component="h1" textAlign={"left"} marginBottom={"30px"}>
        Prossimi eventi:
      </Typography>

      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            backgroundColor: card.backgroundColor,
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{card.title}</h2>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
}
