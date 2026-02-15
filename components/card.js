import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CardsPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error(err));
  }, []);

  const cardStyle = (card) => ({
    backgroundSize: "cover",
    backgroundImage: card.backgroundImage ? `url(${card.backgroundImage})` : "none",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    color: card.textcolor || "#000",
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  })

  return (
    <div style={{ padding: "40px" }}>
      <Typography variant="h4" component="h1" textAlign={"left"} marginBottom={"30px"}>
        Prossimi eventi:
      </Typography>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          900: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <div style={cardStyle(card)}>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <img src={card.Image} style={{borderRadius:"10px"}}/>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
