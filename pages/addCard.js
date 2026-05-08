import { useState } from "react";
import { db } from "../lib/firebase";
import { ref, push } from "firebase/database";
import { serverTimestamp } from "firebase/database";
import { useRouter } from 'next/navigation'; // Se usi la cartella 'app'
// import { useRouter } from 'next/router'; // Se usi la cartella 'pages'
// MUI Components
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Stack,
  
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AddCardForm() {
  const router = useRouter(); // Inizializza il router
  const [formData, setFormData] = useState({ titolo: "", descrizione: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const cardsRef = ref(db, "cards");
      const dataToSave = {
          ...formData,
         datacreazione: serverTimestamp() // Usa il timestamp del server
      };      
      // 1. Aspetta che Firebase salvi i dati
      await push(cardsRef, dataToSave);
      
      // 2. Torna alla home (percorso "/")
      router.push("/"); 

      //data da salvare
      
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };

  // ... resto del componente MUI


  return (
    <Paper
      elevation={3}
      sx={{ p: 4, mb: 5, borderRadius: 3, mx: "auto", maxWidth: 600 }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Aggiungi Nuova Card
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Titolo della Card"
            variant="outlined"
            fullWidth
            required
            value={formData.titolo}
            onChange={(e) => setFormData({...formData, titolo: e.target.value})}
          />
          
          <TextField
            label="Descrizione"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={formData.descrizione}
            onChange={(e) => setFormData({...formData, descrizione: e.target.value})}
          />
         
          <Button 
            type="submit" 
            variant="contained" 
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
          >
            Pubblica Card
          </Button>
            <Button 
            href="../"
            type="submit" 
            variant="outlined" 
            size="small"
            sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
          >
            Torna alla home
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}