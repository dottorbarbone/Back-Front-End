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
  Rating
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { EditLocation } from "@mui/icons-material";
import { useRouter } from 'next/navigation'; //router
export default function CardsPage() {
  const [listaCommesse, setListaCommesse] = useState([]);
  const [loading, setLoading] = useState(true);
 const router = useRouter(); // Inizializza il router
  // Funzione per eliminare una card
  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa commessa?")) {
      const commessaDoc = ref(db, `commesse/${id}`);
      remove(commessaDoc);
    }
  };
  const strutturaStato ={
    1:"Sospeso",
    2:"Presa in carico",
    3:"Fase di lavorazione",
    4:"Fase di collaudo",
  }
    const handleEdit = (id) => {
    // Naviga alla pagina edit passando l'id nell'URL
    router.push(`/editCommesse/${id}`);
  };

  useEffect(() => {
    const commesseRef = ref(db, "commesse"); 

    const unsubscribe = onValue(commesseRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Trasformiamo l'oggetto in array e lo ordiniamo per data decrescente
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

  // Schermata di caricamento
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
      {/* Intestazione con Titolo e Bottone Aggiungi */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Commesse
        </Typography>
        {/*  Eventuale pulsante aggiunta utente */}
      </Box>
      
      <Grid container spacing={3}>
        {listaCommesse.map((commessa) => {
          // Logica per formattare la data all'interno del map
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
            <Grid item xs={12} sm={6} md={4} key={commessa.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: "0.3s",
                "&:hover": { boxShadow: 15 } 
              }}>
                <CardContent sx={{ flexGrow: 5 }}>
                  <Typography gutterBottom variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
                    {commessa.assegnazione || "Senza Assegnazione"}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                   <Rating  icon={ <WarningAmberIcon fontSize="inherit" color="warning" sx={{ fontWeight: "bold" }}/>}
                     emptyIcon={<WarningAmberIcon fontSize="inherit" sx={{ opacity: 0.3 }} />} value={Number(commessa.priorita) || 0} precision={0.5} readOnly size="small" />
                  </Box>
                  <hr/>
                  <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
                    {commessa.descrizione || "Nessuna Descrizione."}
                  </Typography>

                  <Typography variant="body2" color="green" sx={{ mb: 2 }}>
                    Ricompensa: {commessa.ricompensa || "Nessuna Ricompensa."}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Stato: {strutturaStato[commessa.stato] || commessa.stato}
                  </Typography>
                  {commessa.stato >=4 ?  //usare && se non si vuole fare if else
                    <Alert icon={<CheckIcon fontSize="inherit" />} sx={{marginBottom:'20px'}} severity="success">
                      Commessa Completata
                    </Alert> : null
                    }
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
                    onClick={() => handleDelete(commessa.id)}
                  >
                    Elimina
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="warning" 
                    fullWidth
                    startIcon={<EditLocation />}
                    onClick={() => handleEdit(commessa.id)}
                  >
                    Modifica
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {listaCommesse.length === 0 && (
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Non ci sono commesse da visualizzare. Clicca su "Aggiungi Commesse" per crearne una nuova!
      </Alert>
      )}
    </Box>
  );
}