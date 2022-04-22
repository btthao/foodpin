export const copyUrlToClipboard = (id: string) => {
  navigator.clipboard.writeText(process.env.NEXT_PUBLIC_URL + "/recipe/" + id);
};
