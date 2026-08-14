import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src", "data", "project_ideas.json");

// Helper to read local JSON submissions
function readLocalSubmissions(): any[] {
  try {
    if (!fs.existsSync(LOCAL_DATA_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(LOCAL_DATA_PATH, "utf-8");
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error("Error reading local project ideas storage:", err);
    return [];
  }
}

// Helper to write local JSON submissions
function writeLocalSubmissions(data: any[]) {
  try {
    const dir = path.dirname(LOCAL_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local project ideas storage:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, university, category, title, timeline, requirements, budget } = body;

    if (!name || !email || !phone || !university || !title) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Phone, University, Title)." },
        { status: 400 }
      );
    }

    const newIdea = {
      _id: "idea_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      id: "idea_" + Date.now(),
      name,
      email,
      phone,
      university,
      category: category || "General Web / Software",
      title,
      timeline: timeline || "Standard (2-3 Weeks)",
      requirements: requirements || "Standard project scope",
      budget: Number(budget) || 15000,
      status: "Pending Review",
      submittedAt: new Date().toISOString(),
    };

    // 1. Save to Local JSON File Storage
    const localList = readLocalSubmissions();
    localList.unshift(newIdea);
    writeLocalSubmissions(localList);

    // 2. Attempt MongoDB Atlas save
    let mongoSaved = false;
    try {
      const client = await clientPromise;
      const db = client.db("tong_solutions");
      const collection = db.collection("project_ideas");
      const res = await collection.insertOne({ ...newIdea, submittedAt: new Date() });
      mongoSaved = true;
    } catch (dbErr: any) {
      console.warn("MongoDB Atlas connection notice (using persistent local storage fallback):", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Project idea successfully submitted and saved!",
      idea: newIdea,
      mongoSaved
    });
  } catch (error: any) {
    console.error("Error saving project idea:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save project idea." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 1. Load from Local JSON File Storage
    const localList = readLocalSubmissions();

    // 2. Load from MongoDB Atlas if available
    let mongoList: any[] = [];
    let mongoConnected = false;
    try {
      const client = await clientPromise;
      const db = client.db("tong_solutions");
      const collection = db.collection("project_ideas");
      const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray();
      mongoList = docs.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        submittedAt: doc.submittedAt ? new Date(doc.submittedAt).toISOString() : new Date().toISOString(),
      }));
      mongoConnected = true;
    } catch (dbErr: any) {
      console.warn("MongoDB Atlas offline / IP whitelist restricted. Serving from persistent local storage.");
    }

    // 3. Merge submissions by ID / title
    const combinedMap = new Map<string, any>();
    mongoList.forEach((item) => combinedMap.set(item._id || item.id, item));
    localList.forEach((item) => {
      const key = item._id || item.id;
      if (!combinedMap.has(key)) combinedMap.set(key, item);
    });

    const combinedList = Array.from(combinedMap.values());

    return NextResponse.json({
      success: true,
      count: combinedList.length,
      ideas: combinedList,
      mongoConnected
    });
  } catch (error: any) {
    console.error("Error fetching project ideas:", error);
    const fallbackList = readLocalSubmissions();
    return NextResponse.json({
      success: true,
      count: fallbackList.length,
      ideas: fallbackList,
      mongoConnected: false
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (id, status)." },
        { status: 400 }
      );
    }

    // 1. Update Local JSON Storage
    const localList = readLocalSubmissions();
    const updatedLocal = localList.map((item) => {
      if (item._id === id || item.id === id) {
        return { ...item, status, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    writeLocalSubmissions(updatedLocal);

    // 2. Update MongoDB Atlas
    try {
      const client = await clientPromise;
      const db = client.db("tong_solutions");
      const collection = db.collection("project_ideas");

      let query: any = { _id: id };
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) };
      }

      await collection.updateOne(query, {
        $set: { status, updatedAt: new Date() }
      });
    } catch (dbErr) {
      console.warn("MongoDB Atlas update notice (local storage updated):", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Proposal status updated successfully."
    });
  } catch (error: any) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id parameter." },
        { status: 400 }
      );
    }

    // 1. Remove from Local JSON Storage
    const localList = readLocalSubmissions();
    const updatedLocal = localList.filter((item) => item._id !== id && item.id !== id);
    writeLocalSubmissions(updatedLocal);

    // 2. Remove from MongoDB Atlas
    try {
      const client = await clientPromise;
      const db = client.db("tong_solutions");
      const collection = db.collection("project_ideas");

      let query: any = { _id: id };
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) };
      }

      await collection.deleteOne(query);
    } catch (dbErr) {
      console.warn("MongoDB Atlas deletion notice (local storage updated):", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Proposal deleted successfully."
    });
  } catch (error: any) {
    console.error("Error deleting project idea:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project idea." },
      { status: 500 }
    );
  }
}
