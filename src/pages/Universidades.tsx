
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
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner,
  IonCard,
  IonCardContent,
} from '@ionic/react';

interface Universidad {
  name: string;
  domains: string[];
  web_pages: string[];
}

const Universidades: React.FC = () => {
  const [pais, setPais] = useState('');
  const [universidades, setUniversidades] = useState<Universidad[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [consultado, setConsultado] = useState(false);

  const buscarUniversidades = async () => {
    if (!pais.trim()) {
      setError('Escribe el nombre de un país en inglés.');
      setUniversidades([]);
      setConsultado(false);
      return;
    }

    setCargando(true);
    setError('');
    setConsultado(false);
    setUniversidades([]);

    try {
      const url =
        `https://adamix.net/proxy.php?country=${encodeURIComponent(pais.trim())}`;

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error('No se pudo consultar el servicio.');
      }

      const datos: unknown = await respuesta.json();

      // El servicio normalmente devuelve una lista de universidades.
      // También comprobamos si la lista viene dentro de "data".
      let lista: unknown = datos;

      if (
        typeof datos === 'object' &&
        datos !== null &&
        !Array.isArray(datos) &&
        'data' in datos
      ) {
        lista = datos.data;
      }

      if (!Array.isArray(lista)) {
        throw new Error('La respuesta de la API no tiene el formato esperado.');
      }

      const resultados: Universidad[] = lista.map((elemento: unknown) => {
        if (typeof elemento !== 'object' || elemento === null) {
          return {
            name: 'Universidad sin nombre',
            domains: [],
            web_pages: [],
          };
        }

        const registro = elemento as Record<string, unknown>;

        const convertirLista = (valor: unknown): string[] => {
          if (typeof valor === 'string') {
            return valor ? [valor] : [];
          }

          if (Array.isArray(valor)) {
            return valor.filter(
              (item): item is string => typeof item === 'string'
            );
          }

          return [];
        };

        return {
          name:
            typeof registro.name === 'string'
              ? registro.name
              : 'Universidad sin nombre',
          domains: convertirLista(registro.domains),
          web_pages: convertirLista(registro.web_pages),
        };
      });

      setUniversidades(resultados);
      setConsultado(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? `No se pudieron obtener las universidades: ${e.message}`
          : 'Ocurrió un error al consultar las universidades.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Universidades</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Buscar universidades</h2>

        <p>
          Escribe el nombre del país en inglés para consultar
          las universidades disponibles.
        </p>

        <IonInput
          label="País"
          labelPlacement="stacked"
          placeholder="Ejemplo: Dominican Republic"
          value={pais}
          onIonInput={(evento) =>
            setPais(String(evento.detail.value ?? ''))
          }
        />

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={() => void buscarUniversidades()}
          disabled={cargando}
        >
          Buscar universidades
        </IonButton>

        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Buscando universidades...</p>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {consultado && !cargando && universidades.length === 0 && (
          <IonText color="medium">
            <p>No se encontraron universidades para ese país.</p>
          </IonText>
        )}

        {universidades.length > 0 && (
          <>
            <h3>
              Resultados: {universidades.length}
            </h3>

            <IonList>
              {universidades.map((universidad, indice) => (
                <IonCard key={`${universidad.name}-${indice}`}>
                  <IonCardContent>
                    <h2>{universidad.name}</h2>

                    <p>
                      <strong>Dominio:</strong>{' '}
                      {universidad.domains.length > 0
                        ? universidad.domains.join(', ')
                        : 'No disponible'}
                    </p>

                    <p>
                      <strong>Página web:</strong>
                    </p>

                    {universidad.web_pages.length > 0 ? (
                      universidad.web_pages.map((enlace, numero) => (
                        <IonItem
                          key={`${enlace}-${numero}`}
                          href={enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IonLabel className="ion-text-wrap">
                            {enlace}
                          </IonLabel>
                        </IonItem>
                      ))
                    ) : (
                      <p>No hay enlaces disponibles.</p>
                    )}
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Universidades;