import '../styles/globals.css'
import GlobalSpeedDial from '../components/globalfastaction'

export default function App({ Component, pageProps }) {
  return (<>
    <Component {...pageProps} />
    <GlobalSpeedDial />
  </>
  )
}
