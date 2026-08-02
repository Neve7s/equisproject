import { Routes, Route } from "react-router-dom";
import { Layout } from "./app/layout";
import { Home } from "./app/home";
import { ImportCalculator } from "./apps/import-calculator";
import { NotFound } from "./app/not-found";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="apps/import-calculator" element={<ImportCalculator />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
