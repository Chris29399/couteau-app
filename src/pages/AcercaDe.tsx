import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/react';

import {
  personOutline,
  mailOutline,
  callOutline,
  schoolOutline,
  informationCircleOutline,
} from 'ionicons/icons';

// Personaliza estos datos antes de entregar el proyecto.
const Nombre = 'Cristopher';
const Apellido = 'Linares';
const Correo = 'ctlp29399@gmail.com';
const Telefono = '829-341-2175';
const Asignatura = 'Introducción al Desarrollo de Aplicaciones Móviles';

// Coloca tu foto en public/foto_perfil.jpg
const imgPerfil = './public/profile_picture.jpeg';

const Acerca: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Acerca de mí</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonAvatar
              style={{
                width: '160px',
                height: '160px',
                margin: '16px auto',
              }}
            >
              <img src={imgPerfil} alt="Foto de perfil del estudiante" />
            </IonAvatar>

            <h1>
              {Nombre} {Apellido}
            </h1>

            <p>Estudiante y desarrollador en formación</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>
              <IonIcon icon={informationCircleOutline} /> Información
            </h2>

            <IonItem lines="full">
              <IonIcon
                icon={personOutline}
                slot="start"
                color="primary"
              />
              <IonLabel>
                <h3>Nombre completo</h3>
                <p>
                  {Nombre} {Apellido}
                </p>
              </IonLabel>
            </IonItem>

            <IonItem lines="full">
              <IonIcon
                icon={schoolOutline}
                slot="start"
                color="primary"
              />
              <IonLabel>
                <h3>Asignatura</h3>
                <p>{Asignatura}</p>
              </IonLabel>
            </IonItem>

            <IonItem lines="full">
              <IonIcon
                icon={mailOutline}
                slot="start"
                color="primary"
              />
              <IonLabel>
                <h3>Correo electrónico</h3>
                <p>{Correo}</p>
              </IonLabel>
            </IonItem>

            <IonItem lines="none">
              <IonIcon
                icon={callOutline}
                slot="start"
                color="primary"
              />
              <IonLabel>
                <h3>Teléfono</h3>
                <p>{Telefono}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <p
          className="ion-text-center"
          style={{ fontSize: '12px', color: '#777' }}
        >
          Aplicación desarrollada como proyecto académico utilizando
          Ionic, React, TypeScript y APIs públicas.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Acerca;