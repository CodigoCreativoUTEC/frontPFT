"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Create from '@/components/Equipos/Create';

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
