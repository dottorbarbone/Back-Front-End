import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, remove } from "firebase/database";
import {
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
// Importazione del componente PassUtente (il modello della card singola)
import PassUtente from "./passutente";

export default function Utenti() {
  const [listaUtenti, setListaUtenti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Puntiamo al percorso "users" sul database
    const utentiRef = ref(db, "users");

    const unsubscribe = onValue(utentiRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Trasformiamo l'oggetto Firebase in un Array leggibile
        const arrayFormattato = Object.entries(data).map(([id, valore]) => ({
          id: id, // recuperiamo l'ID univoco di Firebase
          ...valore, // nome, cognome, ruolo, etc.
        }));

        // Opzionale: puoi ordinare gli utenti alfabeticamente per nome
        arrayFormattato.sort((a, b) => a.nome.localeCompare(b.nome));

        setListaUtenti(arrayFormattato);
      } else {
        setListaUtenti([]);
      }
      setLoading(false);
    });

    // Cleanup della sottoscrizione
    return () => unsubscribe();
  }, []);

  // Schermata di caricamento (mentre i dati arrivano da Firebase)
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Caricamento utenti...</Typography>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, md: 4 },
        py: 4,
        marginTop: "4rem",
        boxSizing: "border-box",
      }}
    >
      {/* Header con Titolo e Bottone per aggiungere */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Gestione Utenti
        </Typography>
        <Button
          variant="contained"
          href="/addUtente"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Aggiungi Utente
        </Button>
      </Box>

      {/* Griglia Responsive */}
      <Grid container spacing={2}>
        {listaUtenti.map((utente) => (
            
          <Grid
            item
            key={utente.id}
            xs={12} // 1 card su mobile
            sm={6} // 2 card su tablet
            md={4} // 3 card su desktop piccolo
            lg={2.4} // 5 card esatte su desktop grande (12 / 5 = 2.4)
          >
            {/* Usiamo il componente PassUtente passando i dati dinamici */}
            <PassUtente utente={utente} />
          </Grid>
        ))}
      </Grid>

      {/* Messaggio se il database è vuoto */}
      {listaUtenti.length === 0 && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="info"
          sx={{ mt: 4, borderRadius: 2 }}
        >
          Nessun utente trovato nel database. Clicca su "Aggiungi Utente" per
          iniziare!
        </Alert>
      )}
    </Box>
  );
}
