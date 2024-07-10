"use client"
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

type Props = {
  callbackUrl?: string;
  error?: string;
};

const Ingresar = ({ callbackUrl, error }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lee el parámetro de error de la URL y establece el mensaje de error
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setErrorMessage(errorParam);
    }
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message

    const usuario = e.currentTarget["usuario"].value;
    const password = e.currentTarget["password"].value;

    const res = await signIn("credentials", {
      usuario,
      password,
      redirect: false,
      callbackUrl: callbackUrl ?? "/",
    });
    if (res?.error) {
      console.error("Error:", res.error);
      setErrorMessage(res.error);
    } else {
      window.location.href = callbackUrl ?? "/";
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="px-26 py-17.5 text-center">
            <Link className="mb-5.5 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <p className="2xl:px-20">
              Bienvenido al ingreso al sistema de gestion de mantenimiento de equipos clínicos hospitalarios.
            </p>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            {errorMessage && (
              <div className="w-full">
                <h5 className="mb-3 font-semibold text-[#B45454]">
                  Hubo un error con tu envío
                </h5>
                <ul>
                  <li className="leading-relaxed text-[#CD5D5D]">
                    {errorMessage}
                  </li>
                </ul>
              </div>
            )}
            <span className="mb-1.5 block font-medium">Inicio de sesión</span>

            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-sm text-black dark:text-white">
                  Usuario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="usuario"
                    placeholder="Ingresa tu usuario"
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-sm text-black dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Ingresar"
                  className="w-full cursor-pointer rounded border border-primary bg-primary p-3 font-medium text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>

            <button
              onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/" })}
              className="mb-5.5 flex w-full items-center justify-center gap-3.5 rounded border border-stroke bg-gray p-3 font-medium text-black transition hover:bg-opacity-70 dark:border-strokedark dark:text-white"
            >
              <Image
                src={"/images/icon/google-icon.svg"}
                alt="Google"
                width={20}
                height={20}
              />
              Ingresar con Google
            </button>
            <p className="mb-5.5 text-center text-sm text-black dark:text-white">
              Contrasena olvidada?{" "}
              <Link href="/auth/forgot-password" className="text-primary">
                Haz click aquí
              </Link>
            </p>
            <div className="relative mb-5.5 flex items-center justify-center text-center">
              <span className="dark:bg-boxdark bg-white px-4 text-base text-body dark:text-bodydark">
                O
              </span>
              <span className="dark:border-strokedark absolute left-0 top-1/2 block h-[1px] w-full -translate-y-1/2 transform bg-stroke"></span>
            </div>
            <p className="text-center text-sm text-black dark:text-white">
              No tienes cuenta?{" "}
              <Link href="/auth/register" className="text-primary">
                Registrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingresar;
