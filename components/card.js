import { useState, useEffect } from "react";
import { db } from "../lib/firebase"; 
import { ref, onValue, remove } from "firebase/database";
import { 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';


export default function CardsPage() {
  const [listaCard, setListaCard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funzione per eliminare una card
  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa card?")) {
      const cardDoc = ref(db, `cards/${id}`);
      remove(cardDoc);
    }
  };

  useEffect(() => {
    const cardsRef = ref(db, "cards"); 

    const unsubscribe = onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Trasformiamo l'oggetto in array e lo ordiniamo per data decrescente
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

  // Schermata di caricamento
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
      {/* Intestazione con Titolo e Bottone Aggiungi */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Le mie Card
        </Typography>
        <Button 
          variant="contained" 
          href="/addCard" // Assicurati che il percorso sia corretto nel tuo router
          startIcon={<AddIcon />}
        >
          Aggiungi Card
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {listaCard.map((card) => {
          // Logica per formattare la data all'interno del map
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
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: "0.3s",
                "&:hover": { boxShadow: 15 } 
              }}>
                <CardContent sx={{ flexGrow: 5 }}>
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

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(card.id)}
                  >
                    Elimina
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {listaCard.length === 0 && (
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Non ci sono card da visualizzare. Clicca su "Aggiungi Card" per crearne una nuova!
      </Alert>
      )}
    </Box>
  );
}