import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Create from '@/components/Equipos/Crear';

const EquiposCreate = () => {
  
    return (
      <>
        <DefaultLayout>
          <Create />
        </DefaultLayout>
      </>
    );
  }

export default EquiposCreate;
