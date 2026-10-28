import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/react';

import { useNavigate } from 'react-router-dom';

const Inicio: React.FC = () => {
  const history = useNavigate();

  const opciones = [
    { titulo: 'Predicción de género', ruta: '/genero' },
    { titulo: 'Persona aleatoria', ruta: '/persona' },
    { titulo: 'Universidades', ruta: '/universidades' },
    { titulo: 'Clima', ruta: '/clima' },
    { titulo: 'Pokémon', ruta: '/pokemon' },
    { titulo: 'Noticias de WordPress', ruta: '/noticias' },
    { titulo: 'Acerca de mí', ruta: '/acerca' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Couteau — Aplicación Multiusos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <img
            src="./public/toolbox.jpg"
            alt="Caja de herramientas"
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }}
          />

          <IonCardHeader>
            <IonCardTitle>Bienvenido</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Explora las herramientas y servicios disponibles
            en esta aplicación.
          </IonCardContent>
        </IonCard>

        {opciones.map((opcion) => (
          <IonButton
            key={opcion.ruta}
            expand="block"
            className="ion-margin-bottom"
            onClick={() => history(opcion.ruta)}
          >
            {opcion.titulo}
          </IonButton>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Inicio;