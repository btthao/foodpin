type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RecipeBuilderData = RequireAtLeastOne<
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

export type DuplicateRecipeBuilderData = Partial<RecipeBuilderData>;

export type PinOwner = {
  _id: string;
  userName: string;
  image: string;
};

export type RecipeData = RecipeBuilderData & {
  _id: string;
  byUser: PinOwner;
  comments: any[] | null;
  save: any[] | null;
};

export const feedQuery = `*[_type == "recipe"] {
      _id,
      name,
      image1{
        asset->{
          url
        }
      },
      image2,
      destination,
      byUser->{
        _id,
        userName,
        image
      },
      save[]{
        _key,
        byUser->{
          _id,
          userName,
          image
        },
      },
    } `;

export const recipeQuery = (id: string) => {
  return `*[_type == "recipe" && _id == '${id}'] {
      _id,
      name,
      ingredients,
      instructions,
      categories,
      servings,
      image1{
        asset->{
          url
        }
      },
      image2,
      destination,
      byUser->{
        _id,
        userName,
        image
      },
      save[]{
        _key,
        byUser->{
          _id,
          userName,
          image
        },
      },
      comments[]{
        _key,
        comment,
        byUser->{
          _id,
          userName,
          image
        },
      },
    } `;
};
