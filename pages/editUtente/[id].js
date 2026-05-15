import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; 
import { ref, get, update, serverTimestamp } from "firebase/database";
import { useRouter } from 'next/router'; 
import { 
  Box, TextField, Button, Paper, Typography, Stack, Rating, CircularProgress, FormControl, InputLabel, Select, MenuItem 
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query; 

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    nome: "", 
    cognome: "",
    eta: "",
    ruolo: "",
    status: "",
    valutazione: 0,
    avatar: "",
    colore: "success",
    dataUltimaModifica: null // Inizializzato a null
  });

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const userRef = ref(db, `users/${id}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        } else {
          console.error("Utente non trovato");
          router.push("/");
        }
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = ref(db, `users/${id}`);
      
      // Creiamo l'oggetto per l'invio rimuovendo eventuali campi calcolati
      const dataToUpdate = {
        ...formData,
        eta: Number(formData.eta),
        valutazione: Number(formData.valutazione),
        dataUltimaModifica: serverTimestamp() 
      };      
      
      await update(userRef, dataToUpdate);
      router.push("/"); 
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiornamento");
    }
  };

  // Funzione helper per formattare la data esistente nel database
  const formattaData = (timestamp) => {
    if (!timestamp) return "Mai modificato";
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
        Modifica Utente
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            fullWidth
            value={formData.nome || ""}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
          />
          <TextField
            label="Cognome"
            fullWidth
            value={formData.cognome || ""}
            onChange={(e) => setFormData({...formData, cognome: e.target.value})}
          />
          <TextField
            label="Età"
            type="number"
            fullWidth
            value={formData.eta || ""}
            onChange={(e) => setFormData({...formData, eta: e.target.value})}
          />
          <TextField
            label="Ruolo"
            fullWidth
            value={formData.ruolo || ""}
            onChange={(e) => setFormData({...formData, ruolo: e.target.value})}
          />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Colore</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.colore}
                label="Colore"
                onChange={(e) => setFormData({ ...formData, colore: e.target.value })}
              >
                <MenuItem defaultChecked sx={{color:"#2ab150"}} value="success">Verde</MenuItem>
                <MenuItem sx={{color:"#f47442"}} value="warning">Arancione</MenuItem>
                <MenuItem sx={{color:"#cb6032"}} value="error">Rosso</MenuItem>
                <MenuItem sx={{color:"#1976d2"}} value="info">Azzurro</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box>
            <Typography variant="caption" display="block">Valutazione</Typography>
            <Rating
              precision={0.5}
              value={Number(formData.valutazione) || 0}
              onChange={(e, val) => setFormData({...formData, valutazione: val})}
            />
          </Box>

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