export const copyUrlToClipboard = (id: string) => {
  navigator.clipboard.writeText("http://localhost:3000/recipe/" + id);
};
