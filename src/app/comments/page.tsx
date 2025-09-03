import { neon } from "@neondatabase/serverless";

export default function CommentsPage() {
  async function create(formData: FormData) {
    "use server";
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get("comment");
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Leave a Comment
          </h1>
          <form action={create} className="space-y-4">
            <input
              type="text"
              placeholder="write a comment"
              name="comment"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition duration-200"
            >
              Submit
            </button>
          </form>
          <div className="mt-8 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
