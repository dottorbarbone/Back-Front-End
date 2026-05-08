import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, push, serverTimestamp, onValue } from "firebase/database";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  Rating,
  Autocomplete,
  CircularProgress,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddCommessaForm() {
  const router = useRouter();

  // 1. STATI PER IL DATABASE UTENTI
  const [utentiOptions, setUtentiOptions] = useState([]);
  const [loadingUtenti, setLoadingUtenti] = useState(true);

  // 2. STATO FORM
  const [formData, setFormData] = useState({
    descrizione: "",
    assegnazione: "",
    stato: "",
    priorita: 3, // Valore di default per il rating
    ricompensa: "",
  });

  // 3. RECUPERO NOMI UTENTI DAL DB
  useEffect(() => {
    const utentiRef = ref(db, "users");
    const unsubscribe = onValue(utentiRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Mappiamo i dati per ottenere un array di stringhe "Nome Cognome"
        const lista = Object.values(data).map((u) => `${u.nome} ${u.cognome}`);
        setUtentiOptions(lista);
      }
      setLoadingUtenti(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const commessaRef = ref(db, "commesse");

      const dataToSave = {
        ...formData,
        // Conversioni di sicurezza
        stato: Number(formData.stato),
        priorita: Number(formData.priorita),
        ricompensa: Number(formData.ricompensa),
        datacreazione: serverTimestamp(),
      };

      await push(commessaRef, dataToSave);
      router.push("/");
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, mb: 5, borderRadius: 3, mx: "auto", maxWidth: 600 }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
      >
        Aggiungi Nuova Commessa
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* DESCRIZIONE */}
          <TextField
            label="Descrizione"
            variant="outlined"
            fullWidth
            required
            value={formData.descrizione}
            onChange={(e) =>
              setFormData({ ...formData, descrizione: e.target.value })
            }
          />

          {/* ASSEGNAZIONE (Autocomplete Dinamico) */}
          <Autocomplete
            options={utentiOptions}
            freeSolo
            loading={loadingUtenti}
            value={formData.assegnazione}
            // Gestisce la selezione o l'input manuale
            onInputChange={(event, newInputValue) => {
              setFormData({ ...formData, assegnazione: newInputValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assegnazione (Utente)"
                variant="outlined"
                fullWidth
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingUtenti ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {/* STATO */}
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

          {/* PRIORITÀ (Rating con !) */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Priorità
            </Typography>
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
          </Box>

          {/* RICOMPENSA */}
          <TextField
            label="Ricompensa (€)"
            type="number"
            variant="outlined"
            fullWidth
            required
            value={formData.ricompensa}
            onChange={(e) =>
              setFormData({ ...formData, ricompensa: e.target.value })
            }
          />

          {/* BOTTONI */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AddCircleOutlineIcon />}
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
            >
              Salva Commessa
            </Button>

            <Button
              onClick={() => router.back()}
              variant="outlined"
              size="large"
              fullWidth
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
            >
              Annulla
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
