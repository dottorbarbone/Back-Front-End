import { useRouter } from 'next/navigation'; // Importa il router
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from "../lib/firebase";
import { ref, remove } from "firebase/database";

export default function PassUtente({ utente }) {
  const router = useRouter(); // Inizializza il router

  const coloreBordi=()=>{
    if(utente.colore === "success") return "#4caf50";
    if(utente.colore === "error") return "#f44336";
    if(utente.colore === "warning") return "#ff9800"; 
    if(utente.colore === "info") return "#028dff";
  } 


  if (!utente) return null;

  const dataleggibile = utente.datacreazione
    ? new Date(utente.datacreazione).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data non disponibile";

  // FUNZIONE EDIT
  const handleEdit = (id) => {
    // Naviga alla pagina edit passando l'id nell'URL
    router.push(`/editUtente/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente?")) {
      const userRef = ref(db, `users/${id}`);
      remove(userRef);
    }
  };

  return (
    <Card
      sx={{
        borderColor: coloreBordi(),
        borderWidth: 2,
        borderStyle: 'solid',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.06)' }
      }}
    >
      <CardHeader
        avatar={
          <Badge
            color={utente.colore || "primary"}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 35, height: 35 }}>
              {utente.avatar || (utente.nome ? utente.nome[0] : "?")}
            </Avatar>
          </Badge>
        }
        action={
          /* Spostato l'onClick sull'IconButton per catturare meglio il tocco */
          <IconButton size="small" onClick={() => handleEdit(utente.id)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {`${utente.nome || ""} ${utente.cognome || ""}`}
          </Typography>
        }
        subheader={<Typography variant="caption">{utente.ruolo || "Nessun ruolo"}</Typography>}
      />

      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            <Chip 
              icon={<PersonIcon />} 
              label={`${utente.eta || 0} anni`} 
              size="small" 
              sx={{ fontSize: '0.7rem' }} 
            />
            <Chip 
              icon={<CalendarTodayIcon />} 
              label={dataleggibile} 
              size="small" 
              sx={{ fontSize: '0.7rem' }} 
            />
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={Number(utente.valutazione) || 0} precision={0.5} readOnly size="small" />
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>

        <Typography variant="caption" color="text.disabled">
          ID: {utente.id}
        </Typography>
      </CardActions>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          color="error" 
          fullWidth
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(utente.id)}
        >
          Elimina
        </Button>
      </Box>
    </Card>
  );
}