"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI to prevent Server-Side Rendering (SSR) issues
// since Swagger UI relies on the browser's window object.
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const apiSpec = {
  openapi: "3.0.0",
  info: {
    title: "SkinWise API",
    version: "1.0.0",
    description: "API for analyzing skincare ingredient compatibility.",
  },
  paths: {
    "/api/analyze": {
      post: {
        summary: "Analyze compatibility between two products",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  product1Name: {
                    type: "string",
                    example: "Paula's Choice 2% BHA",
                  },
                  product1Ingredients: {
                    type: "string",
                    example:
                      "Water, Methylpropanediol, Salicylic Acid, Camellia Leaf Extract",
                  },
                  product2Name: {
                    type: "string",
                    example: "The Ordinary Retinol 0.5%",
                  },
                  product2Ingredients: {
                    type: "string",
                    example: "Squalane, Retinol, Jojoba Oil",
                  },
                },
                required: ["product1Ingredients", "product2Ingredients"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful analysis",
          },
          "400": {
            description: "Missing ingredients",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export default function SwaggerPage() {
  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px" }}>
      <SwaggerUI spec={apiSpec} />
    </div>
  );
}
