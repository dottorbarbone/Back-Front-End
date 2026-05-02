import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; 
import { ref, get, update, serverTimestamp } from "firebase/database";
import { useRouter } from 'next/router'; 
import { 
  Box, TextField, Button, Paper, Typography, Stack, Rating, CircularProgress 
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditCardPage() {
  const router = useRouter();
  const { id } = router.query; 

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    titolo: "", 
    descrizione: "",
    datacreazione: "",
    dataUltimaModifica: null // Inizializzato a null
  });

  useEffect(() => {
    if (!id) return;

    const fetchCard = async () => {
      try {
        const cardRef = ref(db, `cards/${id}`);
        const snapshot = await get(cardRef);
        
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        } else {
          console.error("Card non trovata");
          router.push("/");
        }
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cardRef = ref(db, `cards/${id}`);
      
      // Creiamo l'oggetto per l'invio rimuovendo eventuali campi calcolati
      const dataToUpdate = {
        ...formData,
        dataUltimaModifica: serverTimestamp() 
      };      
      
      await update(cardRef, dataToUpdate);
      router.push("/"); 
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiornamento");
    }
  };

  // Funzione helper per formattare la data esistente nel database
  const formattaData = (timestamp) => {
    if (!timestamp) return "Mai modificata";
    return new Date(timestamp).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Modifica Card
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Titolo"
            fullWidth
            value={formData.titolo || ""}
            onChange={(e) => setFormData({...formData, titolo: e.target.value})}
          />
          <TextField
            label="Descrizione"
            fullWidth
            value={formData.descrizione || ""}
            onChange={(e) => setFormData({...formData, descrizione: e.target.value})}
          />

          <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Ultima modifica: {formattaData(formData.dataUltimaModifica)}
            </Typography>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ mt: 2 }}
          >
            Salva Modifiche
          </Button>

          <Button 
            onClick={() => router.push('/')} 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Torna indietro
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}