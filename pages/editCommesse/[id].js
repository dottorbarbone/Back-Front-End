import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; 
import { ref, get, update, serverTimestamp } from "firebase/database";
import { useRouter } from 'next/router'; 
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Stack, 
  Rating,
  CircularProgress ,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export default function EditCommessePage() {
  const router = useRouter();
  const { id } = router.query; 

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    stato: "", 
    assegnazione: "",
    datacreazione: "",
    descrizione: "",
    priorita: "",
    ricompensa: "",
    dataUltimaModifica: null // Inizializzato a null
  });

  useEffect(() => {
    if (!id) return;

    const fetchCommesse = async () => {
      try {
        const commessaRef = ref(db, `commesse/${id}`);
        const snapshot = await get(commessaRef);
        
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        } else {
          console.error("Commessa non trovata");
          router.push("/");
        }
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommesse();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const commessaRefRef = ref(db, `commesse/${id}`);
      
      // Creiamo l'oggetto per l'invio rimuovendo eventuali campi calcolati
      const dataToUpdate = {
        ...formData,
        dataUltimaModifica: serverTimestamp() 
      };      
      
      await update(commessaRefRef, dataToUpdate);
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
        Modifica Commessa
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Assegnazione"
            fullWidth
            value={formData.assegnazione || ""}
            onChange={(e) => setFormData({...formData, assegnazione: e.target.value})}
          />
          <TextField
            label="Descrizione"
            fullWidth
            value={formData.descrizione || ""}
            onChange={(e) => setFormData({...formData, descrizione: e.target.value})}
          />
          <TextField
            label="Ricompensa"
            fullWidth
            value={formData.ricompensa || ""}
            onChange={(e) => setFormData({...formData, ricompensa: e.target.value})}
          />
            <Rating
              name="priorita-rating"
              icon={
                <WarningAmberIcon
                  fontSize="inherit"
                  color="warning"
                  sx={{ fontWeight: "bold" }}
                />
              }
              emptyIcon={
                <WarningAmberIcon fontSize="inherit" sx={{ opacity: 0.3 }} />
              }
              precision={0.5}           
              value={Number(formData.priorita)}
              onChange={(e, val) => setFormData({ ...formData, priorita: val })}
            />
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Stato</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.stato}
                label="Stato"
                onChange={(e) => setFormData({ ...formData, stato: e.target.value })}
              >
                <MenuItem defaultChecked sx={{color:"red"}} value={1}>Sospeso</MenuItem>
                <MenuItem sx={{color:"#caca50"}} value={2}>Presa in carico</MenuItem>
                <MenuItem sx={{color:"orange"}} value={3}>Fase di lavorazione</MenuItem>
                <MenuItem sx={{color:"green"}} value={4}>Fase di collaudo</MenuItem>
              </Select>
            </FormControl>
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