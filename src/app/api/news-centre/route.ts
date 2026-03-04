import clientPromise from "@/lib/mongoDB";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message, institution } = body;

        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        await db.collection("news_centre_submissions").updateOne(
            { email },
            {
                $set: {
                    name,
                    email,
                    institution,
                    message,
                    updatedAt: new Date(),
                },
                $setOnInsert: {
                    createdAt: new Date(),
                },
            },
            { upsert: true }
        );

        return new Response(
            JSON.stringify({ message: "Submission successful" }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500 }
        );
    }
}