import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import SearchPage from "./pages/SearchPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import HomePage from "./pages/HomePage"

export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<HomePage/>}>
          <Route index element={<SearchPage />} />
          <Route path="/analytics/:code" element={<AnalyticsPage />}>
            {/* <Route path="" element={<AnalyticsPage />} /> */}
          </Route>
        </Route>
      </Routes>

    </BrowserRouter>
  )
}
