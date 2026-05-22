import { useState } from "react";
import "./styles/index.css";

import { UploadSection, DatasetOverview, DataExploration, CustomAnalysis, ChartResult,
Navbar, Footer, FeatureCards, Login, Register, History } from "./components";

import {uploadDataset, generateCustomChart, } from "./services";

import API_BASE from "./config/api";

function App() {

  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState("home");

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [groupCol, setGroupCol] = useState("");
  const [valueCol, setValueCol] = useState("");
  const [agg, setAgg] = useState("sum");
  const [chartType, setChartType] = useState("bar");

  const [chartData, setChartData] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    try {

      const result = await uploadDataset(
        file,
        currentUser.user_id
      );

      setData(result);
      setPage("dashboard");

      setChartData(null);
      setGroupCol("");
      setValueCol("");
      setAgg("sum");
      setChartType("bar");

    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }
  };

  const generateChart = async () => {

    try {

      const result = await generateCustomChart({
        user_id: currentUser.user_id,
        group_col: groupCol,
        value_col: valueCol,
        agg,
        chart_type: chartType,
      });

      setChartData(result);

    } catch (error) {
      console.log(error);
      alert("Chart generation failed");
    }
  };
  
  return (
  <div>

    {/* Navbar */}
    <Navbar
      data={data}
      setPage={setPage}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
    />
    
    {page === "login" && (
      <Login
        API_BASE={API_BASE}
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    )}

    {page === "register" && (
      <Register
        API_BASE={API_BASE}
        setPage={setPage}
      />
    )}

    <div className="container">

      {page === "home" && (
        <>

          {/* Hero Section */}
          <div className="hero-section">

            <h1 className="main-title">
              AutoInsight
            </h1>

            <p className="main-subtitle">
              Real-Time Data Analytics Platform
            </p>

          </div>

          {/* Upload */}
          {currentUser ? (

            <UploadSection
              file={file}
              setFile={setFile}
              handleUpload={handleUpload}
            />

          ) : (

          <div className="card">

            <h2>
              Please login to use AutoInsight
            </h2>

            <div className="analysis-controls">

              <button onClick={() => setPage("login")}>
                Login
              </button>

              <button onClick={() => setPage("register")}>
                Register
              </button>

            </div>

          </div>

          )}

          {/* Feature Cards */}
          <FeatureCards />  

        </>
      )}

      {page === "dashboard" && data && (
        <>
          {/*DatasetOverview */}
          <DatasetOverview data={data} />
        
          {/* EDA */}
          <DataExploration data={data} />

          {/* CustomAnalysis */}
          <CustomAnalysis
            data={data}
            setGroupCol={setGroupCol}
            setValueCol={setValueCol}
            setAgg={setAgg}
            setChartType={setChartType}
            generateChart={generateChart}
          />

          {/* ChartResult */}
          <ChartResult
            chartData={chartData}
            chartType={chartType}
            agg={agg}
            valueCol={valueCol}
            groupCol={groupCol}
          />

          {/* History */}
          <History/>

        </>
      )}

    </div>

<Footer />
    
  </div>
);
}

export default App;