import React, { useState, useEffect } from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { API_URL } from "../settings";

const AdminPanel = () => {
  const [navn, setNavn] = useState("");
  const [alder, setAlder] = useState("");
  const [klub, setKlub] = useState("");
  const [gender, setGender] = useState("");
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [token, setToken] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [disciplinesData, setDisciplinesData] = useState([]);

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `${API_URL}/api/deltager`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    { manual: true }
  );

  const [{ data: fetchedDisciplinesData }] = useAxios(
    {
      url: `${API_URL}/api/disciplines`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    { manual: true }
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          await refetch();
          setDisciplinesData(fetchedDisciplinesData || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [token, fetchedDisciplinesData, refetch]);

  useEffect(() => {
    const fetchDisciplinesForEdit = async () => {
      if (editId && token) {
        try {
          const result = await axios.get(
            `${API_URL}/api/deltager/${editId}/disciplines`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSelectedDisciplines(
            result.data.map((d) => ({
              value: d.disciplinID,
              label: d.navn,
            }))
          );
        } catch (error) {
          console.error("Error fetching disciplines for edit:", error);
        }
      }
    };

    fetchDisciplinesForEdit();
  }, [editId, token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const dataObj = {
        navn,
        alder,
        klub,
        gender,
        discipliner: selectedDisciplines.map((d) => ({ disciplinID: d.value, navn: d.label })),
      };
  
      let response;
      if (editId) {
        response = await axios.put(
          `${API_URL}/api/deltager/${editId}`,
          dataObj,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/api/deltager`,
          dataObj,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const newDeltagerId = response.data.deltagerID;
  

        const addDisciplinResponse = await axios.put(
          `${API_URL}/api/deltager/${newDeltagerId}/${encodeURIComponent(selectedDisciplines[0].value)}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        console.log('Added disciplin to deltager:', addDisciplinResponse.data);
      }
  
      setNavn("");
      setAlder("");
      setKlub("");
      setGender("");
      setSelectedDisciplines([]);
      setEditId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/api/deltager/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeleteId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.deltagerID);
    setNavn(item.navn);
    setAlder(item.alder);
    setKlub(item.klub);
    setGender(item.gender);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    clearForm();
  };

  const handleDeleteClick = (item) => {
    setDeleteId(item.deltagerID);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const clearForm = () => {
    setNavn("");
    setAlder("");
    setKlub("");
    setGender("");
    setSelectedDisciplines([]);
    setEditId(null);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-4">
            <div className="card-body">
              <h2 className="card-title text-center">
                Tilføj/Edit Deltager
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="navn" className="form-label">
                    Navn:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="navn"
                    value={navn}
                    onChange={(e) => setNavn(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="alder" className="form-label">
                    Alder:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="alder"
                    value={alder}
                    onChange={(e) => setAlder(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="klub" className="form-label">
                    Klub:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="klub"
                    value={klub}
                    onChange={(e) => setKlub(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Køn:
                  </label>
                  <select
                    className="form-select"
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Vælg Køn</option>
                    <option value="Male">Mand</option>
                    <option value="Female">Kvinde</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="disciplines" className="form-label">
                    Disciplines:
                  </label>
                  <CreatableSelect
                    id="disciplines"
                    isMulti
                    value={selectedDisciplines}
                    onChange={(selectedOptions) =>
                      setSelectedDisciplines(selectedOptions || [])
                    }
                    options={disciplinesData.map((d) => ({
                      value: d.disciplinID,
                      label: d.navn,
                    }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="text-center">
                  {editId ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Tilføj Deltager
                    </button>
                  )}
                </div>
              </form>
              {loading && <p className="mt-3 text-center">Loading...</p>}
              {error && (
                <p className="mt-3 text-center">Error: {error.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mt-4">
            <div className="card-body">
              <h2 className="card-title text-center">Deltager List</h2>
              <table className="table mx-auto">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Club</th>
                    <th>Gender</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((item) => (
                      <tr key={item.deltagerID}>
                        <td>{item.navn}</td>
                        <td>{item.alder}</td>
                        <td>{item.klub}</td>
                        <td>{item.gender}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditClick(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(item)}
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
        </div>
      </div>

      {deleteId && (
        <div className="modal fade show" tabIndex="-1" aria-labelledby="deleteModalLabel" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                  Confirm Delete
                </h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this deltager?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPanel;
