import slugify from "slugify";

export function generateSlug(name: string) {
  return slugify(name, { lower: true, strict: true });
}
