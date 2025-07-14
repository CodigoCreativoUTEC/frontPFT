import { Metadata } from "next";
import Landing from "@/components/Landing/Inicio";

export const metadata: Metadata = {
  title:
    "MED-MGT"
};

export default function Home() {
  return (
      //<DefaultLayout>
        //<ECommerce />
        <Landing />
      //</DefaultLayout>
  );
}
