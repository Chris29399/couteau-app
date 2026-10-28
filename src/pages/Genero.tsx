import { useState } from 'react';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
} from '@ionic/react';

interface ResultadoGenero {
  name: string;
  gender: 'male' | 'female' | null;
  probability: number;
}

const Genero: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [resultado, setResultado] =
    useState<ResultadoGenero | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const consultarGenero = async () => {
    if (!nombre.trim()) {
      setError('Por favor, escribe un nombre.');
      setResultado(null);
      return;
    }

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      const respuesta = await fetch(
        `https://api.genderize.io/?name=${encodeURIComponent(nombre.trim())}`
      );

      if (!respuesta.ok) {
        throw new Error('No fue posible consultar la API.');
      }

      const datos: ResultadoGenero = await respuesta.json();

      if (!datos.gender) {
        setError('No se pudo predecir el género de ese nombre.');
        return;
      }

      setResultado(datos);
    } catch {
      setError(
        'Ocurrió un error de conexión. Intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  const colorResultado =
    resultado?.gender === 'male' ? '#1976d2' : '#e91e63';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Predicción de género</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Consultar un nombre</h2>

        <p>
          Escribe un nombre para consultar la predicción
          proporcionada por Genderize.
        </p>

        <IonInput
          label="Nombre"
          labelPlacement="stacked"
          placeholder="Ejemplo: Irma"
          value={nombre}
          onIonInput={(evento) =>
            setNombre(String(evento.detail.value ?? ''))
          }
          onKeyDown={(evento) => {
            if (evento.key === 'Enter') {
              void consultarGenero();
            }
          }}
        />

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={() => void consultarGenero()}
          disabled={cargando}
        >
          Consultar
        </IonButton>

        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Consultando...</p>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {resultado && (
          <IonCard
            style={{
              borderTop: `5px solid ${colorResultado}`,
            }}
          >
            <IonCardContent>
              <h2 style={{ color: colorResultado }}>
                {resultado.name}
              </h2>

              <p>
                Género predicho:{' '}
                <strong>
                  {resultado.gender === 'male'
                    ? 'Masculino'
                    : 'Femenino'}
                </strong>
              </p>

              <p>
                Probabilidad estimada:{' '}
                {(resultado.probability * 100).toFixed(0)}%
              </p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Genero;