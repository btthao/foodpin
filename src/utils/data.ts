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

export type RecipeRef = {
  _key: string;
  recipeId: string;
  recipeRef: RecipeData;
};

export type User = {
  _id: string;
  userName: string;
  image: string;
  createdList: RecipeRef[] | null;
  saveList: RecipeRef[] | null;
};

export type RecipeData = RecipeBuilderData & {
  _id: string;
  byUser: User;
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
        userId,
        byUser->{
          _id,
          userName,
          image
        },
      },
    } `;

export const recipeQuery = (id: string) => {
  return `*[_type == 'recipe' && _id == '${id}'] {
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
        userId,
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

export const searchFeedQuery = (query: string) => {
  return `*[_type == 'recipe' && name match '${query}*' || categories match '${query}*' || ingredients match '${query}*' || instructions match '${query}*']{
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
        userId,
        byUser->{
          _id,
          userName,
          image
        },
      },
    } `;
};

export const userQuery = (userId: string) => {
  return `*[_type == "user" && _id == '${userId}'] {
    _id,
    userName,
    image,
    saveList[]{
      _key,
      recipeId,
      recipeRef->{
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
          userId,
          byUser->{
            _id,
            userName,
            image
          },
        },
      },
    },
    createdList[]{
      _key,
      recipeId,
      recipeRef->{
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
          userId,
          byUser->{
            _id,
            userName,
            image
          },
        },
      },
    },
  }`;
};