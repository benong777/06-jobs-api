import { token, message, enableInput } from "./index.js";
import { showJobs } from "./jobs.js";

/* Delete a job by ID, update UI and show status message.  */
export const handleDelete = async (id) => {
  enableInput(false);

  let method = 'DELETE';
  let url = `/api/v1/jobs/${id}`;

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      message.textContent = "Job deleted successfully.";
      // Refresh the jobs list
      await showJobs();
    } else {
      message.textContent = data.msg || "Failed to delete the job.";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
};