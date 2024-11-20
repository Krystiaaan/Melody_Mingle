import { BaseLayout } from "../../layout/BaseLayout";
import { Navbar } from "../generalComponents/Navbar";
import { MainCard } from "./components/MainCard";

export const MainPage = () => {
  return (
    <div>
      <BaseLayout>
        <Navbar />
        <MainCard />
      </BaseLayout>
    </div>
  );
};
