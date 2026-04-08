import { useState } from "react";
import { useCourses } from "../../context/CoursesContext";
import axios from "axios";

const BATCH_OPTIONS = ["Y24", "Y25", "Y26"];

export default function CreateCourse() {
  const { addCourse } = useCourses();

  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [batch, setBatch] = useState("Y25");

  const handleSubmit = async () => {
    if (!courseId || !name.trim() || !instructor.trim() || !batch) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/courses", {
        courseId: Number(courseId),
        courseName: name,
        instructor: instructor,
        batchYear: batch
      });

      addCourse(res.data); // ✅ Directly send backend response

      alert("✅ Course Added");

      setCourseId("");
      setName("");
      setInstructor("");
      setBatch("Y25");

    } catch (err) {
      console.error(err);
      alert("❌ Error adding course");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <div style={{ width: "380px", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", background: "#fff" }}>

        <h2 style={{ textAlign: "center" }}>➕ Create Course</h2>

        <input type="number" placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Course Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} style={inputStyle} />

        <p><b>Batch Year</b></p>

        <div style={{ display: "flex", gap: "8px" }}>
          {BATCH_OPTIONS.map(b => (
            <button key={b} onClick={() => setBatch(b)} style={{
              flex: 1,
              padding: "10px",
              border: batch === b ? "2px solid green" : "1px solid gray",
              background: batch === b ? "#e8f5e9" : "#fff"
            }}>
              {b}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} style={buttonStyle}>Add Course</button>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "green",
  color: "#fff",
  border: "none",
  marginTop: "10px"
};