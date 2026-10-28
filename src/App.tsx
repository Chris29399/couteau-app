import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';

import Inicio from './pages/Inicio';
import Genero from './pages/Genero';
import Persona from './pages/Persona';
import Universidades from './pages/Universidades';
import Clima from './pages/Clima';
import Pokemon from './pages/Pokemon';
import Noticias from './pages/Noticias';
import AcercaDe from './pages/AcercaDe';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/genero" element={<Genero />} />
        <Route path="/persona" element={<Persona />} />
        <Route path="/universidades" element={<Universidades />} />
        <Route path="/clima" element={<Clima />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/acercade" element={<AcercaDe />} />

        <Route path="/" element={<Inicio />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;