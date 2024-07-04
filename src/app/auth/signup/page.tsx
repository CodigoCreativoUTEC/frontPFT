"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    cedula: '',
    fechaNacimiento: '',
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: searchParams.get('email') || '',
    contrasenia: '',
    confirmPassword: '',
    idPerfil: 2
  });

  const perfilOptions = [
    { type:Number, value: 1, label: 'Administrador' },
    { type:Number, value: 2, label: 'Aux administrativo' },
    { type:Number, value: 3, label: 'Ingeniero biomédico' },
    { type:Number, value: 4, label: 'Tecnico' }
  ];

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      email: searchParams.get('email') || '',
      nombre: searchParams.get('name') || ''
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertir idPerfil a número si es necesario
    const newValue = name === 'idPerfil' ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasenia !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    

    // Construir el objeto UsuarioDto con idPerfil como PerfilDto
  const usuarioDto = {
    ...formData,
    idPerfil: { id: formData.idPerfil }, // Aquí formData.id_perfil es el ID del perfil seleccionado
    idInstitucion : { id: 1 }, // Aquí se debe asignar el ID de la institución
  };

  const res = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioDto),
  });

    if (res.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/login');
    } else {
      console.error(res);
      alert('Error al registrar usuario.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Cédula" required />
      <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} placeholder="Fecha de Nacimiento" required />
      <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required />
      <input type="text" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} placeholder="Nombre de Usuario" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required readOnly />
      <input type="password" name="contrasenia" value={formData.contrasenia} onChange={handleChange} placeholder="Contraseña" required />
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmar Contraseña" required />
      <select name="idPerfil" value={formData.idPerfil} onChange={handleChange}>
        <option value={1}>Administrador</option>
        <option value={2}>Aux administrativo</option>
        <option value={3}>Ingeniero biomédico</option>
        <option value={4}>Técnico</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
}
