import { useState, useEffect } from "react";
// 1. Importa il db dal TUO file (aggiusta il percorso se necessario)
import { db } from "../lib/firebase"; 
// 2. Importa le funzioni di Firebase Database
import { ref, onValue } from "firebase/database";
import { remove } from "firebase/database";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const handleDelete = (id) => {
  const cardDoc = ref(db, `cards/${id}`);
  remove(cardDoc);
};

export default function CardsPage() {
  const [listaCard, setListaCard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Punta alla cartella principale dove tieni tutte le card
    const cardsRef = ref(db, "cards"); 

    // Ascolta i cambiamenti in tempo reale
    const unsubscribe = onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // TRUCCO: Firebase restituisce un oggetto. 
        // Lo trasformiamo in Array per usare il .map()
        const arrayFormattato = Object.entries(data).map(([id, valore]) => ({
          id: id,      // la chiave univoca di Firebase
          ...valore    // tutti i campi (titolo, immagine, etc.)
        }));
        
        setListaCard(arrayFormattato);
      } else {
        setListaCard([]);
      }
      setLoading(false);
    });

    // Cleanup per evitare spreco di memoria
    return () => unsubscribe();
  }, []);

  if (loading) return <Typography>Caricamento dati...</Typography>;

  return (
    <div style={{ padding: "2rem", marginTop: "4rem" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Le mie Card <Button variant="contained" href="../addCard">Aggiungi Card</Button></Typography>
      
      
      <Grid container spacing={3}>
        {listaCard.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card sx={{ height: '100%' }}>

              <CardContent>
                <Typography gutterBottom variant="h5">
                  {card.titolo || "Titolo assente"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.descrizione || "Nessuna descrizione disponibile."}
                </Typography>
                <Button onClick={() => handleDelete(card.id)}>Elimina</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}