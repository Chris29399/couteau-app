import { useEffect, useState } from 'react';

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
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonText,
  IonIcon,
} from '@ionic/react';

import {
  sunnyOutline,
  partlySunnyOutline,
  cloudyOutline,
  rainyOutline,
  thunderstormOutline,
  snowOutline,
  waterOutline,
  speedometerOutline,
  timeOutline,
  refreshOutline,
} from 'ionicons/icons';

interface ClimaActual {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

interface PronosticoDiario {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  sunrise: string[];
  sunset: string[];
}

interface RespuestaClima {
  current: ClimaActual;
  daily: PronosticoDiario;
}

const Clima: React.FC = () => {
  const [clima, setClima] = useState<RespuestaClima | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const obtenerClima = async () => {
    setCargando(true);
    setError('');

    try {
      const url =
        'https://api.open-meteo.com/v1/forecast' +
        '?latitude=18.4861' +
        '&longitude=-69.9312' +
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset' +
        '&timezone=America%2FSanto_Domingo' +
        '&forecast_days=1';

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los datos meteorológicos.');
      }

      const datos: RespuestaClima = await respuesta.json();

      setClima(datos);
    } catch {
      setError(
        'No fue posible consultar el clima. Comprueba tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void obtenerClima();
  }, []);

  const interpretarClima = (codigo: number) => {
    if (codigo === 0) {
      return { texto: 'Cielo despejado', icono: sunnyOutline };
    }

    if (codigo === 1 || codigo === 2) {
      return { texto: 'Parcialmente despejado', icono: partlySunnyOutline };
    }

    if (codigo === 3) {
      return { texto: 'Nublado', icono: cloudyOutline };
    }

    if ([45, 48].includes(codigo)) {
      return { texto: 'Niebla', icono: cloudyOutline };
    }

    if ([51, 53, 55, 56, 57].includes(codigo)) {
      return { texto: 'Llovizna', icono: rainyOutline };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) {
      return { texto: 'Lluvia', icono: rainyOutline };
    }

    if ([71, 73, 75, 77, 85, 86].includes(codigo)) {
      return { texto: 'Nieve', icono: snowOutline };
    }

    if ([95, 96, 99].includes(codigo)) {
      return { texto: 'Tormenta eléctrica', icono: thunderstormOutline };
    }

    return { texto: 'Condiciones variables', icono: cloudyOutline };
  };

  const formatearFecha = (fecha: string) =>
    new Date(`${fecha}T12:00:00`).toLocaleDateString('es-DO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Santo_Domingo',
    });

  const formatearHora = (fecha: string) =>
    new Date(fecha).toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Santo_Domingo',
    });

  const descripcion = clima
    ? interpretarClima(clima.current.weather_code)
    : null;

  const descripcionDiaria = clima
    ? interpretarClima(clima.daily.weather_code[0])
    : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Clima de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Clima en República Dominicana</h2>

        <p>Santo Domingo y sus alrededores</p>

        <IonButton
          expand="block"
          onClick={() => void obtenerClima()}
          disabled={cargando}
        >
          <IonIcon slot="start" icon={refreshOutline} />
          Actualizar clima
        </IonButton>

        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Consultando el clima...</p>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {clima && !cargando && descripcion && descripcionDiaria && (
          <>
            <IonCard>
              <IonCardContent className="ion-text-center">
                <p>{formatearFecha(clima.daily.time[0])}</p>

                <IonIcon
                  icon={descripcion.icono}
                  style={{ fontSize: '76px', color: '#e9a23b' }}
                />

                <h1 style={{ fontSize: '48px', margin: '8px 0' }}>
                  {Math.round(clima.current.temperature_2m)} °C
                </h1>

                <h2>{descripcion.texto}</h2>

                <p>
                  Sensación térmica:{' '}
                  {Math.round(clima.current.apparent_temperature)} °C
                </p>

                <p>Santo Domingo, República Dominicana</p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <h2>Detalles actuales</h2>

                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <IonIcon icon={waterOutline} />
                      <p>Humedad</p>
                      <strong>
                        {clima.current.relative_humidity_2m}%
                      </strong>
                    </IonCol>

                    <IonCol size="6">
                      <IonIcon icon={speedometerOutline} />
                      <p>Viento</p>
                      <strong>
                        {clima.current.wind_speed_10m} km/h
                      </strong>
                    </IonCol>

                    <IonCol size="6">
                      <IonIcon icon={rainyOutline} />
                      <p>Precipitación actual</p>
                      <strong>
                        {clima.current.precipitation} mm
                      </strong>
                    </IonCol>

                    <IonCol size="6">
                      <IonIcon icon={timeOutline} />
                      <p>Probabilidad de lluvia</p>
                      <strong>
                        {clima.daily.precipitation_probability_max[0] ?? '—'}%
                      </strong>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <h2>Pronóstico del día</h2>

                <IonIcon
                  icon={descripcionDiaria.icono}
                  style={{ fontSize: '42px', color: '#e9a23b' }}
                />

                <p>{descripcionDiaria.texto}</p>

                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <p>Temperatura máxima</p>
                      <h2>
                        {Math.round(clima.daily.temperature_2m_max[0])} °C
                      </h2>
                    </IonCol>

                    <IonCol>
                      <p>Temperatura mínima</p>
                      <h2>
                        {Math.round(clima.daily.temperature_2m_min[0])} °C
                      </h2>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <p>
                  <strong>Salida del sol:</strong>{' '}
                  {formatearHora(clima.daily.sunrise[0])}
                </p>

                <p>
                  <strong>Puesta del sol:</strong>{' '}
                  {formatearHora(clima.daily.sunset[0])}
                </p>
              </IonCardContent>
            </IonCard>

            <p style={{ fontSize: '12px', color: '#777' }}>
              Fuente: Open-Meteo. Los datos corresponden a la zona de
              Santo Domingo y pueden variar según la ubicación.
            </p>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Clima;