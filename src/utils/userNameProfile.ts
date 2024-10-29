export function userNameProfile(name: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("")
      .substring(0, 2);
  }

  return "??";
}
