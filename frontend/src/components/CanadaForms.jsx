import React from "react";
import { Link } from "react-router-dom";

const Canada = () => {
  const forms = [
    {
      id: 1,
      title: "Auto Parts Checklist",
      linkEn: "/CaForm1",
      linkFr: "/CaForm1Fr"
    },
    {
      id: 2,
      title: "Auto Parts Introduction Contract",
      linkEn: "/CaForm2",
      linkFr: "/CaForm2Fr"
    },
    {
      id: 3,
      title: "Auto Parts Service Contract",
      linkEn: "/CaForm3",
      linkFr: "/CaForm3Fr"
    },
    {
      id: 4,
      title: "Client Contact Sheet",
      linkEn: "/CaForm4",
      linkFr: "/CaForm4Fr"
    },
    {
      id: 5,
      title: "Dealer Introduction Contract",
      linkEn: "/CaForm5",
      linkFr: "/CaForm5Fr"
    },
    {
      id: 6,
      title: "Dealer Service Contract",
      linkEn: "/CaForm6",
      linkFr: "/CaForm6Fr"
    },
    {
      id: 7,
      title: "Garage Checklist",
      linkEn: "/CaForm7",
      linkFr: "/CaForm7Fr"
    },
    {
      id: 8,
      title: "Garage Introduction Contract",
      linkEn: "/CaForm8",
      linkFr: "/CaForm8Fr"
    },
    {
      id: 9,
      title: "Garage Service Contract",
      linkEn: "/CaForm9",
      linkFr: "/CaForm9Fr"
    },
    {
      id: 10,
      title: "Interview Questions for Garages",
      linkEn: "/CaForm10",
      linkFr: "/CaForm10Fr"
    }
  ];

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s"
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9fafb"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px",
    color: "#111827",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "15px"
  };

  const cardStyle = {
    margin: "15px 0",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    backgroundColor: "white"
  };

  const titleStyle = {
    marginBottom: "15px",
    textAlign: "left",
    borderLeft: "4px solid #22c55e",
    paddingLeft: "10px",
    display: "flex",
    alignItems: "center"
  };

  const idStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    backgroundColor: "#22c55e",
    color: "white",
    borderRadius: "50%",
    marginRight: "12px",
    fontSize: "14px",
    fontWeight: "bold"
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px"
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Canada Forms</h1>
        <p>Select a form in your preferred language</p>
      </div>
      
      {forms.map((form) => (
        <div key={form.id} style={cardStyle}>
          <div style={titleStyle}>
            <span style={idStyle}>{form.id}</span>
            <span style={{ fontWeight: "600", fontSize: "17px" }}>{form.title}</span>
          </div>
          <div style={buttonContainerStyle}>
            <Link to={form.linkEn} style={{ textDecoration: "none" }}>
              <button style={buttonStyle}>
                English
              </button>
            </Link>
            <Link to={form.linkFr} style={{ textDecoration: "none" }}>
              <button style={buttonStyle}>
                French
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Canada;