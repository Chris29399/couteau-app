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
  IonSpinner,
  IonText,
  IonIcon,
} from '@ionic/react';

import {
  openOutline,
  refreshOutline,
  newspaperOutline,
} from 'ionicons/icons';

interface PublicacionWordPress {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      alt_text?: string;
    }>;
  };
}

const URL_API =
  'https://blog.playstation.com/wp-json/wp/v2/posts?per_page=3&_embed';

const Noticias: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<
    PublicacionWordPress[]
  >([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const obtenerNoticias = async () => {
    setCargando(true);
    setError('');

    try {
      const respuesta = await fetch(URL_API);

      if (!respuesta.ok) {
        throw new Error('No fue posible acceder a las publicaciones.');
      }

      const datos: PublicacionWordPress[] = await respuesta.json();

      if (!Array.isArray(datos)) {
        throw new Error('La respuesta de la API no tiene el formato esperado.');
      }

      setPublicaciones(datos);
    } catch {
      setError(
        'No se pudieron cargar las noticias. Es posible que el blog limite el acceso a su API desde aplicaciones externas.'
      );
      setPublicaciones([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void obtenerNoticias();
  }, []);

  const limpiarHTML = (texto: string) => {
    const elemento = document.createElement('div');
    elemento.innerHTML = texto;
    return elemento.textContent ?? elemento.innerText ?? '';
  };

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Santo_Domingo',
    });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Noticias PlayStation</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="ion-text-center">
          <IonIcon
            icon={newspaperOutline}
            style={{ fontSize: '48px' }}
          />
          <h2>PlayStation Blog</h2>
          <p>Las últimas publicaciones del blog oficial.</p>
        </div>

        <IonButton
          expand="block"
          onClick={() => void obtenerNoticias()}
          disabled={cargando}
        >
          <IonIcon slot="start" icon={refreshOutline} />
          Actualizar noticias
        </IonButton>

        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Cargando publicaciones...</p>
          </div>
        )}

        {error && !cargando && (
          <>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>

            <IonButton
              expand="block"
              fill="outline"
              onClick={() => void obtenerNoticias()}
            >
              Intentar de nuevo
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              href="https://blog.playstation.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visitar PlayStation Blog
              <IonIcon slot="end" icon={openOutline} />
            </IonButton>
          </>
        )}

        {!cargando &&
          !error &&
          publicaciones.map((publicacion) => {
            const imagen =
              publicacion._embedded?.['wp:featuredmedia']?.[0]
                ?.source_url;

            return (
              <IonCard key={publicacion.id}>
                {imagen && (
                  <img
                    src={imagen}
                    alt={
                      publicacion._embedded?.['wp:featuredmedia']?.[0]
                        ?.alt_text || 'Imagen de la publicación'
                    }
                    style={{
                      width: '100%',
                      maxHeight: '240px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                <IonCardContent>
                  <p style={{ fontSize: '12px', color: '#777' }}>
                    {formatearFecha(publicacion.date)}
                  </p>

                  <h2>
                    {limpiarHTML(publicacion.title.rendered)}
                  </h2>

                  <p>
                    {limpiarHTML(publicacion.excerpt.rendered)
                      .replace(/\s+/g, ' ')
                      .trim()}
                  </p>

                  <IonButton
                    expand="block"
                    href={publicacion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Leer artículo
                    <IonIcon slot="end" icon={openOutline} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            );
          })}

        {!cargando && !error && publicaciones.length === 0 && (
          <p>No hay publicaciones disponibles en este momento.</p>
        )}

        <p style={{ fontSize: '12px', color: '#777' }}>
          Fuente: PlayStation Blog. Los artículos pertenecen a sus
          respectivos autores y se abren en el sitio oficial.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Noticias;