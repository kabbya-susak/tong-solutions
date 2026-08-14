import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, university, category, title, timeline, requirements, budget } = body;

    // Basic validation
    if (!name || !email || !phone || !university || !title) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Phone, University, Title)." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("tong_solutions");
    const collection = db.collection("project_ideas");

    const newIdea = {
      name,
      email,
      phone,
      university,
      category: category || "General Web / Software",
      title,
      timeline: timeline || "Standard (2-3 Weeks)",
      requirements: requirements || "Standard project scope",
      budget: budget || 15000,
      status: "Pending Review",
      submittedAt: new Date(),
    };

    const result = await collection.insertOne(newIdea);

    return NextResponse.json({
      success: true,
      message: "Project idea successfully submitted and saved to database!",
      insertedId: result.insertedId,
    });
  } catch (error: any) {
    console.error("Error saving project idea to MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save project idea." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tong_solutions");
    const collection = db.collection("project_ideas");

    const ideas = await collection.find({}).sort({ submittedAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      count: ideas.length,
      ideas,
    });
  } catch (error: any) {
    console.error("Error fetching project ideas from MongoDB:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch project ideas." },
      { status: 500 }
    );
  }
}
