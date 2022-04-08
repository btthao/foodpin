import type { NextApiRequest, NextApiResponse } from "next";
import recipeDataScraper from "recipe-data-scraper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const recipe = await recipeDataScraper(req.body.url);
    res.status(200).json({ recipe });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
