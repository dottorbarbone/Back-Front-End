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
export default function PassUtente({ utente }) {
  // Se non c'è l'utente, non renderizzare nulla
  if (!utente) return null;

  // Trasformiamo il timestamp di Firebase in una stringa leggibile
  const dataleggibile = utente.datacreazione
    ? new Date(utente.datacreazione).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data non disponibile";

  return (
    <Card
      sx={{
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
          <IconButton size="small">
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
            {/* CORREZIONE QUI: Usiamo dataleggibile direttamente, senza utente. davanti */}
            <Chip 
              icon={<CalendarTodayIcon />} 
              label={dataleggibile} 
              size="small" 
              sx={{ fontSize: '0.7rem' }} 
            />
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Assicuriamoci che la valutazione sia un numero */}
            <Rating value={Number(utente.valutazione) || 0} precision={0.5} readOnly size="small" />
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Chip 
          label={utente.status || "Sconosciuto"} 
          color={utente.colore || "default"} 
          size="small" 
          sx={{ height: 20, fontSize: '0.6rem' }} 
        />
        <Typography variant="caption" color="text.disabled">
          ID: {utente.id}
        </Typography>
      </CardActions>
    </Card>
  );
}