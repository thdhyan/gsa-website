import { neon } from "@neondatabase/serverless";
import Link from "next/link";

export default async function ViewCommentsPage() {
  // Connect to the Neon database
  const sql = neon(`${process.env.DATABASE_URL}`);

  // Query all comments from the database
  const comments = await sql`SELECT * FROM comments ORDER BY id DESC`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            All Comments
          </h1>

          <div className="space-y-4 mb-8">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-800">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No comments yet. Be the first to leave one!
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <a
              href="/comments"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Add Comment
            </a>
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
