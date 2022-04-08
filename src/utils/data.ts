type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type recipeBuilderData = RequireAtLeastOne<
  {
    name: string;
    servings: string;
    categories?: string[];
    ingredients: string[];
    instructions: string[];
    image1?: any;
    image2?: string;
    destination?: string;
  },
  "image1" | "image2"
>;

export type duplicateRecipeBuilderData = Partial<recipeBuilderData>;
