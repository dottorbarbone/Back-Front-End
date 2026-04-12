import { useState } from "react";
import { db } from "../lib/firebase";
import { ref, push, serverTimestamp } from "firebase/database";
import { useRouter } from 'next/navigation';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Stack,
  Rating
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AddUserForm() {
  const router = useRouter();
  
  // STATO UNIFORMATO AL MINUSCOLO (per combaciare con PassUtente)
  const [formData, setFormData] = useState({ 
    nome: "", 
    cognome: "",
    eta: "",
    ruolo: "",
    status: "",
    valutazione: "",
    avatar: "",
    colore: "success", // Valore di default
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userRef = ref(db, "users");
      
      const dataToSave = {
        ...formData,
        // Convertiamo l'età e valutazione in numeri per sicurezza
        eta: Number(formData.eta),
        valutazione: Number(formData.valutazione),
        datacreazione: serverTimestamp() 
      };      
      
      await push(userRef, dataToSave);
      
      // Torna alla pagina degli utenti dopo il salvataggio
      router.push("/"); 

    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: 3, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Aggiungi Nuovo Utente
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            required
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
          />
          
          <TextField
            label="Cognome"
            variant="outlined"
            fullWidth
            required
            value={formData.cognome}
            onChange={(e) => setFormData({...formData, cognome: e.target.value})}
          />

          <TextField
            label="Età"
            type="number"
            variant="outlined"
            fullWidth
            required
            value={formData.eta}
            onChange={(e) => setFormData({...formData, eta: e.target.value})}
          />

          <TextField
            label="Ruolo (es: Manager, Sviluppo)"
            variant="outlined"
            fullWidth
            required
            value={formData.ruolo}
            onChange={(e) => setFormData({...formData, ruolo: e.target.value})}
          />

          <TextField
            label="Status (es: Casa, Online)"
            variant="outlined"
            fullWidth
            required
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          />

            <Rating
            name="simple-controlled"
            value={formData.valutazione ? Number(formData.valutazione) : 0}
            onChange={(e) => setFormData({...formData, valutazione: e.target.value})}
            precision={0.5}
            defaultValue={2.5}
            />
          <TextField
            label="Iniziali Avatar (es: MB)"
            variant="outlined"
            fullWidth
            required
            value={formData.avatar}
            onChange={(e) => setFormData({...formData, avatar: e.target.value})}
          />

          <TextField
            label="Colore Badge (primary, success, warning, error)"
            variant="outlined"
            fullWidth
            value={formData.colore}
            onChange={(e) => setFormData({...formData, colore: e.target.value})}
            helperText="Usa: primary, success, warning o error"
          />
         
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 2, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
          >
            Salva Utente
          </Button>

          <Button 
            onClick={() => router.back()}
            variant="outlined" 
            size="large"
            sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
          >
            Annulla
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}