import { useCourses } from "../../context/CoursesContext";
import axios from "axios";

export default function ManageCourses() {
  const { courseList, updateCourse, deleteCourse } = useCourses();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:8080/courses/${id}`);
      deleteCourse(id);
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting course");
    }
  };

  const handleUpdate = async (id) => {
    const title = prompt("Enter new course name:");
    const instructor = prompt("Enter new instructor:");

    if (!title || !instructor) return;

    try {
      await axios.put(`http://localhost:8080/courses/${id}`, {
        courseName: title,
        instructor: instructor
      });

      updateCourse(id, { title, instructor });
    } catch (err) {
      console.error(err);
      alert("❌ Error updating course");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        ⚙️ Manage Courses
      </h1>

      {courseList.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No courses available. Please add a course.
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Instructor</th>
              <th style={thStyle}>Batch</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courseList.map((c) => (
              <tr key={c.id} style={rowStyle}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.title}</td>
                <td style={tdStyle}>{c.instructor}</td>
                <td style={tdStyle}>{c.batch}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleUpdate(c.id)}
                    style={editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "10px",
  overflow: "hidden"
};

const thStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "600",
  textAlign: "center"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  textAlign: "center"
};

const rowStyle = {
  transition: "background 0.2s"
};

const editBtn = {
  marginRight: "10px",
  padding: "6px 12px",
  background: "#2196F3",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const deleteBtn = {
  padding: "6px 12px",
  background: "#f44336",
  color: "#fff",

  borderRadius: "6px",
  cursor: "pointer"
};