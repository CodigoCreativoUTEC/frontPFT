"use client";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Importa useRouter y usePathname
import { useSession } from "next-auth/react";
import React from "react";

const LoginForm = () => {
    const router = useRouter(); // Instancia de useRouter
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Redirige si ya está autenticado y la sesión es válida, o fuerza logout si está vacía/incompleta
    React.useEffect(() => {
        if (
            status === "authenticated" &&
            session &&
            (session.user?.email || session.jwt)
        ) {
            router.replace("/usuarios");
        } else if (
            status === "authenticated" &&
            (!session || (!session.user?.email && !session.jwt)) &&
            pathname !== "/auth/signin" && pathname !== "/auth/login"
        ) {
            signOut({ callbackUrl: "/auth/signin" });
        } else if (
            status === "unauthenticated" &&
            pathname !== "/auth/signin" && pathname !== "/auth/login"
        ) {
            signOut({ callbackUrl: "/auth/signin" });
        }
    }, [status, session, router, pathname]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Reset error message

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                setError("Email o contraseña incorrectos.");
            } else {
                setError(result.error);
            }
        } else if (result) {
            console.log("Logged in successfully");
            router.push("/usuarios");
        } else {
            console.error("Unexpected error during login");
        }
    };

    const handleGoogleSignIn = async () => {
    const result = await signIn("google", { redirect: false });
        if (result?.error) {
            setError(result.error);
        } else if (result) {
            console.log("Logged in with Google successfully");
            router.push("/usuarios");
        } else {
            console.error("Unexpected error during Google login");
        }
    };


    return (
    <form onSubmit={handleSubmit}>
        {error && <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                    fill="#ffffff"
                    stroke="#ffffff"
                ></path>
                </svg>
            </div>
            <div className="w-full">
                <h5 className="mb-3 font-semibold text-[#B45454]">
                Ocurrio un problema
                </h5>
                <ul>
                    <li className="leading-relaxed text-[#CD5D5D]">
                        {error}
                    </li>
                </ul>
            </div>
        </div>}
    <div className="mb-4">
        <label htmlFor="email" className="mb-2.5 block font-medium text-black dark:text-white">
            Email:
        </label>
        <div className="relative">
        <input
            id="email"
            type="text"
            value={email}
            placeholder="Ingrese su correo electrónico"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
    </div>
    </div>
    <div className="mb-6">
        <label htmlFor="password" className="mb-2.5 block font-medium text-black dark:text-white">
            Contraseña:
        </label>
        <div className="relative">
        <input
            id="password"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    </div>
    </div>

    <div className="mb-5.5">
        <button
            type="submit"
            className="w-full rounded bg-primary p-3 font-medium text-gray"
        >
            Ingresar
        </button>
    </div>
    <div className="mb-5.5">
        <button
            type="button"
            className="flex w-full items-center justify-center rounded border border-stroke bg-white p-3 font-medium text-black shadow-1 dark:border-strokedark dark:bg-boxdark"
            onClick={handleGoogleSignIn}
        >
        <span className="mr-3">
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_191_13499)">
                <path
                    d="M19.805 10.2305C19.805 9.56523 19.7482 8.93636 19.6445 8.33398H10.2V12.0666H15.605C15.355 13.3055 14.6782 14.3666 13.6936 15.0483V17.2305H16.805C18.605 15.5666 19.805 13.123 19.805 10.2305Z"
                    fill="#4285F4"
                />
                <path
                    d="M10.2 20.0004C12.805 20.0004 14.9782 19.123 16.6936 17.5666L13.6936 15.0483C12.805 15.6483 11.605 16.0004 10.2 16.0004C7.69364 16.0004 5.605 14.2305 4.805 11.9666H1.69364V14.2305C3.405 17.5666 6.605 20.0004 10.2 20.0004Z"
                    fill="#34A853"
                />
                <path
                    d="M4.805 11.9666C4.605 11.3666 4.505 10.723 4.505 10.0666C4.505 9.41023 4.605 8.76663 4.805 8.16663V5.90283H1.69364C0.905 7.56663 0.405 9.41023 0.405 11.0666C0.405 12.723 0.905 14.5666 1.69364 16.2305L4.805 11.9666Z"
                    fill="#FBBC05"
                />
                <path
                    d="M10.2 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                    fill="#EB4335"
                />
                </g>
                <defs>
                <clipPath id="clip0_191_13499">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
                </defs>
            </svg>
        </span> Ingresar usando Google
        </button>
    </div>
    <div className="mt-6 text-center">
        <p>
            No tienes cuenta?{" "}
            <Link href="/auth/signup" className="text-primary">
                Registrarme
            </Link>
        </p>
    </div>
    </form>
);
};

export default LoginForm;