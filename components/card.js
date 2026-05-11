'use client'; // Importante per Next.js App Router

import { useState, useEffect } from "react";
import { db } from "../lib/firebase"; 
import { ref, onValue, remove } from "firebase/database";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { EditLocation } from "@mui/icons-material";
import { useRouter } from 'next/navigation';

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// --- IMPORT STILI SWIPER ---
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CardsPage() {
  const [listaCard, setListaCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa card?")) {
      const cardDoc = ref(db, `cards/${id}`);
      remove(cardDoc);
    }
  };

  const handleEdit = (id) => {
    router.push(`/editCard/${id}`);
  };

  useEffect(() => {
    const cardsRef = ref(db, "cards"); 
    const unsubscribe = onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arrayFormattato = Object.entries(data)
          .map(([id, valore]) => ({
            id: id,
            ...valore
          }))
          .sort((a, b) => (b.datacreazione || 0) - (a.datacreazione || 0));
        setListaCard(arrayFormattato);
      } else {
        setListaCard([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Caricamento dati...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", marginTop: "4rem" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Le mie Card
        </Typography>
      </Box>
      
      {listaCard.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30} // Spazio tra le card
          slidesPerView={1} // Default mobile: 1 card
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            // Quando la larghezza è >= 640px (Tablet)
            640: {
              slidesPerView: 2,
            },
            // Quando la larghezza è >= 1024px (Desktop)
            1024: {
              slidesPerView: 3,
            },
          }}
          style={{ padding: '20px 10px 50px 10px' }} // Padding extra per ombre e paginazione
        >
          {listaCard.map((card) => {
            const dataleggibile = card.datacreazione 
              ? new Date(card.datacreazione).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }) 
              : "Data non disponibile";

            return (
              <SwiperSlide key={card.id}>
                <Card sx={{ 
                  height: 'auto', // Altezza fissa per uniformità nello slider
                  minHeight: '300px', // Altezza minima per evitare card troppo piccole
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: "0.5s",
                  "&:hover": { boxShadow: 15 } 
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.titolo || "Senza Titolo"}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {card.descrizione || "Nessuna descrizione."}
                    </Typography>
                    
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 2 }}>
                      Creato il: {dataleggibile}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(card.id)}
                    >
                      Elimina
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="warning" 
                      fullWidth
                      startIcon={<EditLocation />}
                      onClick={() => handleEdit(card.id)}
                    >
                      Modifica
                    </Button>
                  </Box>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Non ci sono card da visualizzare. Clicca su "Aggiungi Card" per crearne una nuova!
        </Alert>
      )}
    </Box>
  );
}