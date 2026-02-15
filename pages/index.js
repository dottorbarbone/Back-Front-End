import CardsPage from "./card"

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    }}>
      <div>
       <CardsPage />
      </div>
    </main>
  )
}
