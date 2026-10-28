import { useState } from 'react';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonImg,
  IonSpinner,
  IonText,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

interface PersonaDatos {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
  dob: {
    date: string;
    age: number;
  };
  email: string;
  location: {
    country: string;
    city: string;
  };
}

interface RespuestaAPI {
  results: PersonaDatos[];
}

const Persona: React.FC = () => {
  const [persona, setPersona] = useState<PersonaDatos | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const obtenerPersona = async () => {
    setCargando(true);
    setError('');

    try {
      const respuesta = await fetch(
        'https://randomuser.me/api/?results=1'
      );

      if (!respuesta.ok) {
        throw new Error('No se pudo consultar el servicio.');
      }

      const datos: RespuestaAPI = await respuesta.json();

      if (!datos.results || datos.results.length === 0) {
        throw new Error('La API no devolvió ninguna persona.');
      }

      setPersona(datos.results[0]);
    } catch {
      setError(
        'No se pudo obtener una persona. Comprueba tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Persona aleatoria</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Generador de personas</h2>

        <p>
          Pulsa el botón para generar una persona ficticia
          y consultar sus datos.
        </p>

        <IonButton
          expand="block"
          onClick={() => void obtenerPersona()}
          disabled={cargando}
        >
          {persona ? 'Generar otra persona' : 'Generar persona'}
        </IonButton>

        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Obteniendo datos...</p>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {persona && !cargando && (
          <IonCard>
            <IonImg
              src={persona.picture.large}
              alt={`Fotografía de ${persona.name.first}`}
              style={{
                width: '180px',
                height: '180px',
                margin: '20px auto 0',
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            />

            <IonCardContent>
              <h2 className="ion-text-center">
                {persona.name.first} {persona.name.last}
              </h2>

              <IonList lines="full">
                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <strong>Fecha de nacimiento</strong>
                    <p>{formatearFecha(persona.dob.date)}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <strong>Edad</strong>
                    <p>{persona.dob.age} años</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <strong>Correo electrónico</strong>
                    <p>{persona.email}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <strong>Ciudad</strong>
                    <p>{persona.location.city}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel className="ion-text-wrap">
                    <strong>País</strong>
                    <p>{persona.location.country}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Persona;