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
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonChip,
  IonIcon,
} from '@ionic/react';

import {
  searchOutline,
  volumeHighOutline,
  flashOutline,
} from 'ionicons/icons';

interface HabilidadPokemon {
  ability: {
    name: string;
  };
}

interface DatosPokemon {
  name: string;
  id: number;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
  base_experience: number | null;
  abilities: HabilidadPokemon[];
  cries?: {
    latest?: string;
    legacy?: string | null;
  };
}

const Pokemon: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [pokemon, setPokemon] = useState<DatosPokemon | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const buscarPokemon = async () => {
    const nombreBuscado = nombre.trim().toLowerCase();

    if (!nombreBuscado) {
      setError('Escribe el nombre de un Pokémon.');
      setPokemon(null);
      return;
    }

    setCargando(true);
    setError('');
    setPokemon(null);

    try {
      const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nombreBuscado)}`
      );

      if (!respuesta.ok) {
        throw new Error('Pokémon no encontrado.');
      }

      const datos: DatosPokemon = await respuesta.json();
      setPokemon(datos);
    } catch {
      setError(
        'No se encontró ese Pokémon o hubo un problema de conexión. Intenta con otro nombre.'
      );
    } finally {
      setCargando(false);
    }
  };

  const imagenPokemon =
    pokemon?.sprites.other?.['official-artwork']?.front_default ??
    pokemon?.sprites.front_default;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Pokédex</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Busca tu Pokémon favorito</h2>
        <p>
          Consulta su imagen, experiencia, habilidades y sonido.
        </p>

        <IonItem>
          <IonLabel position="stacked">Nombre del Pokémon</IonLabel>
          <IonInput
            value={nombre}
            placeholder="Ejemplo: Pikachu"
            onIonInput={(evento) =>
              setNombre(String(evento.detail.value ?? ''))
            }
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') {
                void buscarPokemon();
              }
            }}
          />
        </IonItem>

        <IonButton
          expand="block"
          onClick={() => void buscarPokemon()}
          disabled={cargando}
        >
          <IonIcon slot="start" icon={searchOutline} />
          Buscar Pokémon
        </IonButton>

        {cargando && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Buscando Pokémon...</p>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {pokemon && !cargando && (
          <>
            <IonCard>
              <IonCardContent className="ion-text-center">
                <p>Pokémon n.º {pokemon.id}</p>

                {imagenPokemon && (
                  <img
                    src={imagenPokemon}
                    alt={`Imagen de ${pokemon.name}`}
                    style={{
                      width: '230px',
                      maxWidth: '100%',
                      height: '230px',
                      objectFit: 'contain',
                    }}
                  />
                )}

                <h1 style={{ textTransform: 'capitalize' }}>
                  {pokemon.name}
                </h1>

                <IonChip color="primary">
                  <IonIcon icon={flashOutline} />
                  <IonLabel>
                    Experiencia base:{' '}
                    {pokemon.base_experience ?? 'No disponible'}
                  </IonLabel>
                </IonChip>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <h2>Habilidades</h2>

                {pokemon.abilities.length > 0 ? (
                  pokemon.abilities.map((elemento) => (
                    <IonChip key={elemento.ability.name}>
                      <IonLabel
                        style={{ textTransform: 'capitalize' }}
                      >
                        {elemento.ability.name.replace('-', ' ')}
                      </IonLabel>
                    </IonChip>
                  ))
                ) : (
                  <p>No hay habilidades disponibles.</p>
                )}
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <h2>
                  <IonIcon icon={volumeHighOutline} /> Sonido
                </h2>

                {pokemon.cries?.latest || pokemon.cries?.legacy ? (
                  <audio
                    controls
                    style={{ width: '100%' }}
                    src={
                      pokemon.cries.latest ??
                      pokemon.cries.legacy ??
                      undefined
                    }
                  >
                    Tu navegador no permite reproducir este audio.
                  </audio>
                ) : (
                  <p>No hay sonido disponible para este Pokémon.</p>
                )}
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Pokemon;