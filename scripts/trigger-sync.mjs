async function main() {
  try {
    console.log("Triggering local sync endpoint...");
    const res = await fetch("http://localhost:3000/api/admin/sync", {
      method: "POST"
    });
    const data = await res.json();
    console.log("Sync result:", data);
  } catch (err) {
    console.error("Failed to trigger sync. Is the dev server running on port 3000?", err.message);
  }
}
main();
