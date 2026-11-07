import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let firstname = sessionStorage.getItem("firstname");
    let lastname = sessionStorage.getItem("lastname");
    let name = "";

    if (firstname && lastname && firstname !== "null" && lastname !== "null") {
      name = `${firstname} ${lastname}`;
    } else {
      name = sessionStorage.getItem("username") || "Anonymous";
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" ");

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        window.location.href = window.location.origin + "/dealer/" + id;
      } else {
        alert("Failed to post review: " + (json.message || "Status " + json.status));
      }
    } catch (err) {
      console.error("Error posting review:", err);
      alert("Network error while submitting review");
    }
  };

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();

      if (retobj.status === 200 && retobj.dealer) {
        let dealer_data = Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer;
        setDealer(dealer_data || {});
      }
    } catch (err) {
      console.error("Error fetching dealer details:", err);
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url, { method: "GET" });
      const retobj = await res.json();

      if (retobj.CarModels && Array.isArray(retobj.CarModels)) {
        setCarmodels(retobj.CarModels);
      } else if (retobj.models && Array.isArray(retobj.models)) {
        setCarmodels(retobj.models);
      }
    } catch (err) {
      console.error("Error fetching car models:", err);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)}></textarea>
        
        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className='input_field'>
          Car Make and Model 
          <select name="cars" id="cars" defaultValue="" onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, idx) => {
              const make = carmodel.CarMake || carmodel.make || "";
              const mod = carmodel.CarModel || carmodel.model || "";
              return (
                <option key={idx} value={`${make} ${mod}`}>
                  {make} {mod}
                </option>
              );
            })}
          </select>
        </div>

        <div className='input_field'>
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2026} min={2015} />
        </div>

        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;