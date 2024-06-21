import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./settings";
import { useAuth } from "./context/AuthProvider";

function Deltager() {
  const auth = useAuth();
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [deltager, setDeltager] = useState(null);
  const [resultat, setResultat] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formValues, setFormValues] = useState({
    disciplinID: "",
    date: "",
    score: "",
    resultatID: null // Used for tracking the ID of the result being edited
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setToken(token);
          const headers = { Authorization: `Bearer ${token}` };

          const deltagerResponse = await axios.get(`${API_URL}/api/deltager/${id}`, { headers });
          setDeltager(deltagerResponse.data);

          const resultatResponse = await axios.get(`${API_URL}/api/resultater/${id}`, { headers });
          setResultat(resultatResponse.data);

          const disciplinerResponse = await axios.get(`${API_URL}/api/discipliner`, { headers });
          setDisciplines(disciplinerResponse.data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteResultat = async (resultatId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this result?");
      if (confirmDelete) {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_URL}/api/resultater/${resultatId}`, { headers });

        // Remove the deleted resultat from the state
        setResultat(resultat.filter((item) => item.resultatID !== resultatId));
      }
    } catch (error) {
      console.error("Error deleting resultat:", error);
      // Handle error
    }
  };

  const handleEditResultat = (resultatId) => {
    // Find the result in the state based on resultatId
    const resultToEdit = resultat.find((item) => item.resultatID === resultatId);

    // Set form values to populate the edit form
    setFormValues({
      disciplinID: resultToEdit.disciplin.disciplinID,
      date: resultToEdit.dato,
      score: resultToEdit.resultatværdi,
      resultatID: resultatId // Set the resultatID for editing
    });

    // Optionally, you can set an edit mode or display a modal for editing
    // This depends on your UI/UX design and how you want to handle editing.
  };

  const handleNewResult = async (event) => {
    event.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch deltager and disciplin to set in the new Resultat
      const [deltagerResponse, disciplinResponse] = await Promise.all([
        axios.get(`${API_URL}/api/deltager/${id}`, { headers }),
        axios.get(`${API_URL}/api/discipliner/${formValues.disciplinID}`, { headers })
      ]);

      const deltager = deltagerResponse.data;
      const disciplin = disciplinResponse.data;

      const newResult = {
        deltager: deltager,
        disciplin: disciplin,
        dato: formValues.date,
        resultatværdi: formValues.score
      };

      let resultatResponse;
      if (formValues.resultatID) {
        // Update existing result
        resultatResponse = await axios.put(`${API_URL}/api/resultater/${formValues.resultatID}`, newResult, { headers });
      } else {
        // Create new result
        resultatResponse = await axios.post(`${API_URL}/api/resultater`, newResult, { headers });
      }

      const updatedResultat = resultat.map(item => {
        if (item.resultatID === formValues.resultatID) {
          // Update existing result in state
          return resultatResponse.data;
        }
        return item;
      });

      setResultat(updatedResultat);

      // Clear form values after successful submission
      setFormValues({
        disciplinID: "",
        date: "",
        score: "",
        resultatID: null // Clear the resultatID after update or creation
      });
    } catch (error) {
      console.error("Error creating/editing result:", error);
      // Handle error
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  if (loading) {
    return <div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!deltager) {
    return null; // or handle this case as per your application's requirements
  }

  return (
    <div className="container">
      <div className="text-center">
        <h2>{deltager.navn}</h2>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Personal Information</h3>
              <table className="table">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{deltager.navn}</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>{deltager.gender}</td>
                  </tr>
                  <tr>
                    <th>Age</th>
                    <td>{deltager.alder}</td>
                  </tr>
                  <tr>
                    <th>Club</th>
                    <td>{deltager.klub}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          {resultat.length > 0 && (
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="card-title">Result Information</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Discipline</th>
                      <th>Result Value</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultat.map((item, index) => (
                      <tr key={index}>
                        <td>{item.dato}</td>
                        <td>{item.disciplin.navn}</td>
                        <td>{item.resultatværdi}</td>
                        <td>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleEditResultat(item.resultatID)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteResultat(item.resultatID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Add New Result</h3>
              <form onSubmit={handleNewResult}>
                <div className="mb-3">
                  <label htmlFor="disciplinID" className="form-label">Discipline</label>
                  <select
                    className="form-select"
                    id="disciplinID"
                    name="disciplinID"
                    value={formValues.disciplinID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Discipline</option>
                    {disciplines.map((discipline) => (
                      <option key={discipline.disciplinID} value={discipline.disciplinID}>{discipline.navn}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formValues.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="score" className="form-label">Score</label>
                  <input
                    type="text"
                    className="form-control"
                    id="score"
                    name="score"
                    value={formValues.score}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Result</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deltager;
