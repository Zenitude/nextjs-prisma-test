'use server'

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json({users}, {status: 200});
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if(!name) {
      return NextResponse.json({error: "Field name not found"}, {status: 400});
    }

    const createdUser = await prisma.user.create({
      data: {
        name: name
      }
    });

    console.log("createdUser : ", createdUser);

    return NextResponse.json({message: "User created !", user: createdUser}, {status: 201});
  }
  catch(error) {
    return NextResponse.json({error: `Error POST : ${error}`}, {status: 500})
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        name: name
      }
    });

    return NextResponse.json({message: "User updated !", user: updatedUser}, {status: 201});
  }
  catch(error) {
    return NextResponse.json({error: `Error PUT : ${error}`}, {status: 500})
  } 
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if(!id) {
      return NextResponse.json({error: "Field id not found"}, {status: 400})
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: id
      }
    });

    console.log("deletedUser : ", deletedUser);

    return NextResponse.json({message: "User deleted !", user: deletedUser}, {status: 201});
  }
  catch(error) {
    return NextResponse.json({error: `Error DELETE : ${error}`}, {status: 500})
  }
  
}