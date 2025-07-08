import { Metadata } from "next";
import Landing from "@/components/Landing/Inicio";

export const metadata: Metadata = {
  title:
    "MA-MED"
};

export default function Home() {
  return (
      //<DefaultLayout>
        //<ECommerce />
        <Landing />
      //</DefaultLayout>
  );
}
