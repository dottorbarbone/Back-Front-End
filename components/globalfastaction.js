import React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PrintIcon from '@mui/icons-material/Print'; // Import corretto
import { useRouter } from 'next/router';
import ChecklistIcon from '@mui/icons-material/Checklist';
export default function GlobalSpeedDial() {
  const router = useRouter();

  const handleStampaPagina = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Definiamo le azioni dentro il componente per poter usare le funzioni locali
  const actions = [
    { icon: <AddIcon />, name: 'Nuova Card', route: '/addCard' },
    { icon: <PersonAddIcon />, name: 'Nuovo Utente', route: '/addUtente' },
    { icon: <ChecklistIcon />, name: 'Nuova Commessa', route: '/addCommessa' },
    { 
      icon: <PrintIcon />, 
      name: 'Stampa Pagina', 
      operation: handleStampaPagina // Usiamo una proprietà diversa per la funzione
    },
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial globale"
      sx={{ 
        position: 'fixed', 
        bottom: 32, 
        right: 32,
        // Nascondiamo lo Speed Dial stesso durante la stampa
        '@media print': { display: 'none' } 
      }} 
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            if (action.operation) {
              action.operation(); // Se c'è una funzione (stampa), eseguila
            } else {
              router.push(action.route); // Altrimenti naviga
            }
          }}
        />
      ))}
    </SpeedDial>
  );
}