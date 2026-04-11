import CardsPage from "../components/card"
import Typography from "@mui/material/Typography";
import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/navbar'
export default function Home() {
  return (
    <main style={{
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    }}>
      <>
      <Navbar />
      <CardsPage />
      
      </>
    </main>
  )
}
