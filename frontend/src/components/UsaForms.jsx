import React from "react";
import { Link } from "react-router-dom";

const USA = () => {
  const forms = [
    { id: 1, title: "Auto Parts Checklist", link: "/USForm1" },
    { id: 2, title: "Auto Parts Introduction Contract", link: "/USForm2" },
    { id: 3, title: "Auto Parts Service Contract", link: "/USForm3" },
    { id: 4, title: "Client Contact Sheet", link: "/USForm4" },
    { id: 5, title: "Dealer Introduction Contract", link: "/USForm5" },
    { id: 6, title: "Dealer Service Contract", link: "/USForm6" },
    { id: 7, title: "Garage Checklist", link: "/USForm7" },
    { id: 8, title: "Garage Introduction Contract", link: "/USForm8" },
    { id: 9, title: "Garage Service Contract", link: "/USForm9" },
    { id: 10, title: "Interview Questions for Garages", link: "/USForm10" }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {forms.map((form) => (
        <div key={form.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <Link
            to={form.link}
            className="block bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium py-3 px-6 rounded transition-colors text-center"
          >
            {form.id}. {form.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default USA;