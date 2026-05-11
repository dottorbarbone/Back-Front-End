'use client'; 

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
  Rating
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { EditLocation } from "@mui/icons-material";
import { useRouter } from 'next/navigation';

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// --- IMPORT STILI SWIPER ---
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CommessePage() {
  const [listaCommesse, setListaCommesse] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const strutturaStato = {
    1: "Sospeso",
    2: "Presa in carico",
    3: "Fase di lavorazione",
    4: "Fase di collaudo",
  };

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa commessa?")) {
      const commessaDoc = ref(db, `commesse/${id}`);
      remove(commessaDoc);
    }
  };

  const handleEdit = (id) => {
    router.push(`/editCommesse/${id}`);
  };

  useEffect(() => {
    const commesseRef = ref(db, "commesse"); 
    const unsubscribe = onValue(commesseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arrayFormattato = Object.entries(data)
          .map(([id, valore]) => ({
            id: id,
            ...valore
          }))
          .sort((a, b) => (b.datacreazione || 0) - (a.datacreazione || 0));
        setListaCommesse(arrayFormattato);
      } else {
        setListaCommesse([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Caricamento Dati...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", marginTop: "1rem" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Commesse
        </Typography>
      </Box>
      
      {listaCommesse.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ padding: '20px 10px 60px 10px' }}
        >
          {listaCommesse.map((commessa) => {
            const dataleggibile = commessa.datacreazione 
              ? new Date(commessa.datacreazione).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }) 
              : "Data non disponibile";

            return (
              <SwiperSlide key={commessa.id}>
                <Card sx={{ 
                  height: 'auto',
                  minHeight: '450px', // Leggermente più alto per i contenuti extra delle commesse
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: "0.3s ease-in-out",
                  "&:hover": { boxShadow: 10 },
                  borderRadius: '16px',
                  border: '1px solid #eaeaea',
                  // --- FIX NITIDEZZA ---
                  transform: 'translateZ(0)', 
                  backfaceVisibility: 'hidden',
                  WebkitFontSmoothing: 'antialiased'
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="body1" sx={{ fontWeight: 'bold' }}>
                      {commessa.assegnazione || "Senza Assegnazione"}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        icon={<WarningAmberIcon fontSize="inherit" color="warning" />}
                        emptyIcon={<WarningAmberIcon fontSize="inherit" sx={{ opacity: 0.3 }} />} 
                        value={Number(commessa.priorita) || 0} 
                        precision={0.5} 
                        readOnly 
                        size="small" 
                      />
                    </Box>
                    
                    <hr style={{ opacity: 0.2, marginBottom: '16px' }} />
                    
                    <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 'medium' }}>
                      {commessa.descrizione || "Nessuna Descrizione."}
                    </Typography>

                    <Typography variant="body2" color="success.main" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Ricompensa: {commessa.ricompensa || "Nessuna Ricompensa."}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Stato: <strong>{strutturaStato[commessa.stato] || commessa.stato}</strong>
                    </Typography>

                    {commessa.stato >= 4 && (
                      <Alert icon={<CheckIcon fontSize="inherit" />} sx={{ mb: 2 }} severity="success">
                        Completata
                      </Alert>
                    )}

                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                      Creato il: {dataleggibile}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      color="warning" 
                      fullWidth
                      startIcon={<EditLocation />}
                      onClick={() => handleEdit(commessa.id)}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Modifica
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(commessa.id)}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Elimina
                    </Button>
                  </Box>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Non ci sono commesse da visualizzare.
        </Alert>
      )}
    </Box>
  );
}