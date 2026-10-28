import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from '@ionic/react';

interface PaginaBaseProps {
  titulo: string;
  descripcion: string;
}

const PaginaBase: React.FC<PaginaBaseProps> = ({
  titulo,
  descripcion,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>

          <IonTitle>{titulo}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
      </IonContent>
    </IonPage>
  );
};

export default PaginaBase;
