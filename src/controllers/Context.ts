import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
export type Context = {
    response: Response;
    request: Request;
}